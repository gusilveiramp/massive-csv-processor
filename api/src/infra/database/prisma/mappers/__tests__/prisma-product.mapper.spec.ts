import { Product, ProductExchangeRate } from '@prisma/client';
import { ProductEntity } from '../../../../../modules/products/entities/product.entity';
import { ProductExchangeRateEntity } from '../../../../../modules/products/entities/product-exchange-rate.entity';
import { PrismaProductMapper } from '../prisma-product.mapper';
import { Decimal } from '@prisma/client/runtime/library';

describe('PrismaProductMapper', () => {
  it('should map ProductEntity to Prisma format', () => {
    const entity = new ProductEntity({
      name: 'Test Product',
      price: 100,
      expiration: new Date('2025-12-31'),
      exchange_rates: [
        new ProductExchangeRateEntity({
          currency: 'eur',
          exchange_rate: 0.9,
          converted_price: 90,
        }),
      ],
    });

    const prisma = PrismaProductMapper.toPrisma(entity);

    expect(prisma).toEqual({
      name: 'Test Product',
      price: 100,
      expiration: new Date('2025-12-31'),
      exchangeRates: {
        create: [
          {
            currency: 'eur',
            exchangeRate: 0.9,
            convertedPrice: 90,
          },
        ],
      },
    });
  });

  it('should map Prisma object to ProductEntity', () => {
    const prismaData: Product & { exchangeRates: ProductExchangeRate[] } = {
      id: 1,
      name: 'Test Product',
      price: new Decimal(100),
      expiration: new Date('2025-12-31'),
      createdAt: new Date('2024-01-01'),
      updatedAt: new Date('2024-02-01'),
      deletedAt: null,
      exchangeRates: [
        {
          id: 10,
          productId: 1,
          currency: 'usd',
          exchangeRate: new Decimal(1),
          convertedPrice: new Decimal(100),
        },
      ],
    };

    const entity = PrismaProductMapper.toEntity(prismaData);

    // validate correct instance
    expect(entity).toBeInstanceOf(ProductEntity);
    expect(entity.exchange_rates?.[0]).toBeInstanceOf(
      ProductExchangeRateEntity,
    );

    // validate content
    expect(entity.id).toBe(1);
    expect(entity.name).toBe('Test Product');
    expect(entity.price).toBe(100);
    expect(entity.expiration?.toISOString()).toBe('2025-12-31T00:00:00.000Z');
    expect(entity.exchange_rates?.[0].currency).toBe('usd');
    expect(entity.exchange_rates?.[0].converted_price).toBe(100);
  });
});
