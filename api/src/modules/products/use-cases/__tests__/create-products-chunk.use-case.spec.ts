import { CreateProductsChunkUseCase } from '../create-products-chunks.use-case';
import { ProductsInMemoryRepository } from '../../repositories/products-in-memory.respository';
import { CreateProductWithExchangeRatesDto } from '../../dto/create-product-with-exchange-rates.dto';

describe('CreateProductsChunkUseCase', () => {
  let useCase: CreateProductsChunkUseCase;
  let repository: ProductsInMemoryRepository;

  beforeEach(() => {
    repository = new ProductsInMemoryRepository();
    useCase = new CreateProductsChunkUseCase(repository);
  });

  it('should create multiple products with exchange rates', async () => {
    const chunk: CreateProductWithExchangeRatesDto[] = [
      {
        name: 'Product A',
        price: 100,
        expiration: new Date('2025-01-01'),
        exchange_rates: [
          { currency: 'eur', exchange_rate: 0.9, converted_price: 90 },
          { currency: 'brl', exchange_rate: 5.0, converted_price: 500 },
        ],
      },
      {
        name: 'Product B',
        price: 200,
        expiration: new Date('2025-02-01'),
        exchange_rates: [
          { currency: 'eur', exchange_rate: 1.1, converted_price: 220 },
        ],
      },
    ];

    await useCase.execute(chunk);

    const all = await repository.search();
    expect(all.products.length).toBe(2);

    const productA = all.products[0];
    expect(productA.name).toBe('Product A');
    expect(productA.exchange_rates?.length).toBe(2);

    const eurRate = productA.exchange_rates?.find((r) => r.currency === 'eur');
    expect(eurRate?.converted_price).toBe(90);
  });

  it('should do nothing if chunk is empty', async () => {
    await useCase.execute([]);

    const all = await repository.search();
    expect(all.products.length).toBe(0);
  });
});
