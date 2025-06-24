import { Test, TestingModule } from '@nestjs/testing';
import { PrismaProductsRepository } from '../prisma-product.repository';
import { PrismaService } from '../../prisma.service';
import { ProductEntity } from '../../../../../modules/products/entities/product.entity';
import { ProductExchangeRateEntity } from '../../../../../modules/products/entities/product-exchange-rate.entity';

describe('PrismaProductsRepository - createMany', () => {
  let repository: PrismaProductsRepository;
  let prisma: PrismaService;

  const mockPrismaService = {
    $transaction: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaProductsRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    repository = module.get(PrismaProductsRepository);
    prisma = module.get(PrismaService);
  });

  it('should bulk insert products and their exchange rates', async () => {
    const mockProducts: ProductEntity[] = [
      new ProductEntity({
        name: 'Product 1',
        price: 10.5,
        expiration: new Date('2025-12-31'),
        exchange_rates: [
          new ProductExchangeRateEntity({
            currency: 'eur',
            exchange_rate: 0.9,
            converted_price: 9.45,
          }),
        ],
      }),
      new ProductEntity({
        name: 'Product 2',
        price: 20,
        expiration: new Date('2026-01-01'),
        exchange_rates: [],
      }),
    ];

    const mockInsertedIds = [{ id: 1 }, { id: 2 }];

    const createManyMock = jest.fn();
    const queryRawMock = jest.fn().mockResolvedValue(mockInsertedIds);

    mockPrismaService.$transaction.mockImplementation(async (cb: any) => {
      return cb({
        $queryRawUnsafe: queryRawMock,
        productExchangeRate: {
          createMany: createManyMock,
        },
      });
    });

    await repository.createMany(mockProducts);

    expect(queryRawMock).toHaveBeenCalled();
    expect(createManyMock).toHaveBeenCalledWith({
      data: [
        {
          productId: 1,
          currency: 'eur',
          exchangeRate: 0.9,
          convertedPrice: 9.45,
        },
      ],
    });
  });

  it('should not insert anything if product list is empty', async () => {
    const result = await repository.createMany([]);
    expect(result).toBeUndefined();
    expect(mockPrismaService.$transaction).not.toHaveBeenCalled();
  });
});
