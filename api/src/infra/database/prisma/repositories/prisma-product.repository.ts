import { Injectable } from '@nestjs/common';

import { ProductEntity } from '../../../../modules/products/entities/product.entity';
import { ProductsRepository } from '../../../../modules/products/repositories/products.repository';
import { PrismaService } from '../prisma.service';
import { PrismaProductMapper } from '../mappers/prisma-product.mapper';

@Injectable()
export class PrismaProductsRepository implements ProductsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // As I am doing a single Prisma .create() that includes related entities (exchangeRates) in one atomic query,
  // No additional transaction needed.
  async create(product: ProductEntity): Promise<ProductEntity> {
    const productMappedToPrisma = PrismaProductMapper.toPrisma(product);
    const createdProduct = await this.prisma.product.create({
      data: productMappedToPrisma,
      include: {
        exchangeRates: true,
      },
    });
    return PrismaProductMapper.toEntity(createdProduct);
  }

  async createMany(products: ProductEntity[]): Promise<void> {
    if (!products.length) return;

    const now = new Date();
    const productValues: unknown[] = [];
    const productPlaceholders: string[] = [];

    products.forEach((product, index) => {
      const baseIndex = index * 5;
      productValues.push(
        product.name,
        product.price,
        product.expiration,
        now,
        now,
      );
      productPlaceholders.push(
        `($${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4}, $${baseIndex + 5})`,
      );
    });

    const insertProductsQuery = `
      INSERT INTO "products" (name, price, expiration, created_at, updated_at)
      VALUES ${productPlaceholders.join(', ')}
      RETURNING id
    `;

    await this.prisma.$transaction(async (tx) => {
      const insertedProducts = await tx.$queryRawUnsafe<{ id: number }[]>(
        insertProductsQuery,
        ...productValues,
      );

      const exchangeRatesToInsert = insertedProducts.flatMap(
        (insertedProduct, i) => {
          const product = products[i];

          if (!product.exchange_rates || product.exchange_rates.length === 0) {
            return [];
          }

          return product.exchange_rates.map((rate) => ({
            productId: insertedProduct.id,
            currency: rate.currency,
            exchangeRate: rate.exchange_rate,
            convertedPrice: rate.converted_price,
          }));
        },
      );

      if (exchangeRatesToInsert.length > 0) {
        await tx.productExchangeRate.createMany({
          data: exchangeRatesToInsert,
        });
      }
    });
  }

  async findById(id: number): Promise<ProductEntity | null> {
    const product = await this.prisma.product.findUnique({
      where: { id, deletedAt: null },
      include: { exchangeRates: true },
    });
    return product ? PrismaProductMapper.toEntity(product) : null;
  }

  async update(
    id: number,
    productData: Partial<ProductEntity>,
  ): Promise<ProductEntity | null> {
    const productMappedToPrisma = PrismaProductMapper.toPrisma(productData);
    const updatedProduct = await this.prisma.product.update({
      where: { id, deletedAt: null },
      data: {
        ...productMappedToPrisma,
        exchangeRates: productMappedToPrisma.exchangeRates
          ? {
              deleteMany: {}, // Deletes all existing exchange rates for this product
              create: productMappedToPrisma.exchangeRates.create, // Adds the new exchange rates
            }
          : undefined, // If `exchangeRates` is not provided, it remains unchanged
      },
      include: { exchangeRates: true },
    });

    return updatedProduct ? PrismaProductMapper.toEntity(updatedProduct) : null;
  }

  async delete(id: number): Promise<boolean> {
    try {
      await this.prisma.product.update({
        where: {
          id,
          deletedAt: null, // só "deleta" se ainda não estiver deletado
        },
        data: {
          deletedAt: new Date(), // marca como deletado
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async search(
    search?: string,
    page = 1,
    limit = 10,
  ): Promise<{ products: ProductEntity[]; total: number }> {
    const sanitizedLimit = Number(limit);
    const skip = (page - 1) * sanitizedLimit;
    const sanitizedSearch = search?.trim().replace(/^"|"$/g, '');

    // Fetch products with search filter
    const products = await this.prisma.product.findMany({
      where: {
        deletedAt: null,
        ...(sanitizedSearch
          ? {
              name: {
                contains: sanitizedSearch,
                mode: 'insensitive',
              },
            }
          : {}),
      },
      skip,
      take: sanitizedLimit,
      include: {
        exchangeRates: true, // Include related exchange rates if needed
      },
    });

    // Count total records
    const total = await this.prisma.product.count({
      where: {
        deletedAt: null,
        ...(sanitizedSearch
          ? {
              name: {
                contains: sanitizedSearch,
                mode: 'insensitive',
              },
            }
          : {}),
      },
    });

    return {
      products: products.map(PrismaProductMapper.toEntity),
      total,
    };
  }
}
