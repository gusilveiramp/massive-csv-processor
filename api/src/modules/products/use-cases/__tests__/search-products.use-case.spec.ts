import { SearchProductsUseCase } from '../search-products.use-case';
import { ProductsInMemoryRepository } from '../../repositories/products-in-memory.respository';
import { ProductEntity } from '../../entities/product.entity';

describe('SearchProductsUseCase', () => {
  let useCase: SearchProductsUseCase;
  let repository: ProductsInMemoryRepository;

  beforeEach(() => {
    repository = new ProductsInMemoryRepository();
    useCase = new SearchProductsUseCase(repository);
  });

  it('should return paginated products without search term', async () => {
    // Cria 15 produtos
    for (let i = 1; i <= 15; i++) {
      await repository.create(
        new ProductEntity({
          name: `Product ${i}`,
          price: i * 10,
          expiration: new Date('2026-01-01'),
          exchange_rates: [],
        }),
      );
    }

    const { products, total } = await useCase.execute({ page: 1, limit: 10 });
    expect(products.length).toBe(10);
    expect(total).toBe(15);
  });

  it('should return filtered products when search term is provided', async () => {
    await repository.create(
      new ProductEntity({
        name: 'Phone X',
        price: 1000,
        expiration: new Date(),
        exchange_rates: [],
      }),
    );
    await repository.create(
      new ProductEntity({
        name: 'Laptop Y',
        price: 2000,
        expiration: new Date(),
        exchange_rates: [],
      }),
    );

    const result = await useCase.execute({
      search: 'phone',
      page: 1,
      limit: 10,
    });

    expect(result.products.length).toBe(1);
    expect(result.products[0].name).toBe('Phone X');
    expect(result.total).toBe(1);
  });
});
