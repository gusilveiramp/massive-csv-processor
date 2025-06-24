import { UpdateProductUseCase } from '../update-product.use-case';
import { ProductsInMemoryRepository } from '../../repositories/products-in-memory.respository';
import { ProductEntity } from '../../entities/product.entity';
import { NotFoundException } from '@nestjs/common';
import { EnvService } from '../../../../infra/env/env.service';
import { CurrencyService } from '../../../currency/currency.service';

describe('UpdateProductUseCase', () => {
  let useCase: UpdateProductUseCase;
  let repository: ProductsInMemoryRepository;
  let mockCurrencyService: CurrencyService;
  let mockEnvService: EnvService;

  beforeEach(() => {
    repository = new ProductsInMemoryRepository();

    mockCurrencyService = {
      getExchangeRates: jest.fn().mockResolvedValue({
        eur: 1.1,
        brl: 5.2,
      }),
    } as unknown as CurrencyService;

    mockEnvService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'CURRENCY_BASE') return 'usd';
        if (key === 'CURRENCY_TARGETS') return ['eur', 'brl'];
        return undefined;
      }),
    } as unknown as EnvService;

    useCase = new UpdateProductUseCase(
      repository,
      mockCurrencyService,
      mockEnvService,
    );
  });

  it('should update an existing product with new exchange rates', async () => {
    const created = await repository.create(
      new ProductEntity({
        name: 'Original Name',
        price: 100,
        expiration: new Date('2026-01-01'),
        exchange_rates: [],
      }),
    );

    const updated = await useCase.execute(created.id!, {
      name: 'Updated Name',
      price: 200,
    });

    expect(updated?.name).toBe('Updated Name');
    expect(updated?.price).toBe(200);

    const eur = updated?.exchange_rates?.find((r) => r.currency === 'eur');
    expect(eur?.converted_price).toBeCloseTo(220, 2); // 200 * 1.1
  });

  it('should throw NotFoundException if product does not exist', async () => {
    await expect(
      useCase.execute(999, { name: 'Does not exist' }),
    ).rejects.toThrow(NotFoundException);
  });
});
