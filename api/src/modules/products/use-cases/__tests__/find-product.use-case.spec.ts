import { FindProductUseCase } from '../find-product.use-case';
import { ProductsInMemoryRepository } from '../../repositories/products-in-memory.respository';
import { ProductEntity } from '../../entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('FindProductUseCase', () => {
  let useCase: FindProductUseCase;
  let repository: ProductsInMemoryRepository;

  beforeEach(() => {
    repository = new ProductsInMemoryRepository();
    useCase = new FindProductUseCase(repository);
  });

  it('should return a product by id', async () => {
    const created = await repository.create(
      new ProductEntity({
        name: 'Product A',
        price: 100,
        expiration: new Date('2026-01-01'),
        exchange_rates: [],
      }),
    );

    const found = await useCase.execute(Number(created.id));

    expect(found).toEqual(created);
  });

  it('should throw NotFoundException if product does not exist', async () => {
    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
  });
});
