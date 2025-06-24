import { Product, ProductExchangeRate } from '@prisma/client';
import { ProductEntity } from '../../../../modules/products/entities/product.entity';
import { ProductExchangeRateEntity } from '../../../../modules/products/entities/product-exchange-rate.entity';

export class PrismaProductMapper {
  // Convert ProductEntity → Prisma format
  static toPrisma(product: ProductEntity) {
    return {
      name: product.name,
      price: product.price,
      expiration: product.expiration,
      exchangeRates: {
        create: product.exchange_rates?.map((rate) => ({
          currency: rate.currency,
          exchangeRate: rate.exchange_rate,
          convertedPrice: rate.converted_price,
        })),
      },
    };
  }

  // Convert Prisma response → ProductEntity
  static toEntity(
    product: Product & { exchangeRates: ProductExchangeRate[] },
  ): ProductEntity {
    return new ProductEntity({
      id: product.id,
      name: product.name,
      price: product.price ? Number(product.price) : null,
      expiration: product.expiration,
      created_at: product.createdAt,
      updated_at: product.updatedAt,
      exchange_rates: product.exchangeRates.map(
        (rate) =>
          new ProductExchangeRateEntity({
            id: rate.id,
            currency: rate.currency,
            exchange_rate: Number(rate.exchangeRate),
            converted_price: Number(rate.convertedPrice),
          }),
      ),
    });
  }
}
