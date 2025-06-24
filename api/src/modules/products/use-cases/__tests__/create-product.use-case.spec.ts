import { CreateProductUseCase } from '../create-product.use-case';

import { CreateProductDto } from '../../dto/create-product.dto';
import { ProductsInMemoryRepository } from '../../repositories/products-in-memory.respository';
import { CurrencyService } from '../../../currency/currency.service';
import { EnvService } from '../../../../infra/env/env.service';

describe('CreateProductUseCase', () => {
  let useCase: CreateProductUseCase;
  let repository: ProductsInMemoryRepository;
  let mockCurrencyService: CurrencyService;
  let mockEnvService: EnvService;

  beforeEach(() => {
    repository = new ProductsInMemoryRepository();

    mockCurrencyService = {
      getExchangeRates: jest.fn().mockResolvedValue({
        eur: 0.9,
        brl: 5.0,
      }),
    } as unknown as CurrencyService;

    mockEnvService = {
      get: jest.fn().mockImplementation((key: string) => {
        if (key === 'CURRENCY_BASE') return 'usd';
        if (key === 'CURRENCY_TARGETS') return ['eur', 'brl'];
        return undefined;
      }),
    } as unknown as EnvService;

    useCase = new CreateProductUseCase(
      repository,
      mockCurrencyService,
      mockEnvService,
    );
  });

  it('should create a product with exchange rates', async () => {
    const dto: CreateProductDto = {
      name: 'Smartphone X',
      price: 1000,
      expiration: new Date('2025-12-31'),
    };

    const product = await useCase.execute(dto);
    expect(product.exchange_rates?.length).toBe(2);
    expect(product.exchange_rates?.[0]).toHaveProperty('currency');
    expect(mockCurrencyService.getExchangeRates).toHaveBeenCalledWith('usd', [
      'eur',
      'brl',
    ]);
    expect(product).toHaveProperty('id');
    expect(product.name).toBe('Smartphone X');
    expect(product.price).toBe(1000);

    const eurRate = product.exchange_rates?.find((r) => r.currency === 'eur');
    expect(eurRate?.converted_price).toBe(900); // 1000 * 0.9

    const brlRate = product.exchange_rates?.find((r) => r.currency === 'brl');
    expect(brlRate?.converted_price).toBe(5000); // 1000 * 5.0
  });

  it('should create a product without exchange rates', async () => {
    const dto: CreateProductDto = {
      name: 'Notebook Y',
      price: 2000,
      expiration: new Date('2026-01-01'),
    };

    const product = await useCase.execute(dto);

    expect(product.exchange_rates?.length).toBe(2);
    expect(product.exchange_rates?.[0]).toHaveProperty('currency');
  });

  it('should auto-increment product ID', async () => {
    const p1 = await useCase.execute({
      name: 'P1',
      price: 10,
      expiration: new Date('2026-01-01'),
    });

    const p2 = await useCase.execute({
      name: 'P2',
      price: 20,
      expiration: new Date('2026-01-01'),
    });

    expect(p1.id).toBe(1);
    expect(p2.id).toBe(2);
  });
});
