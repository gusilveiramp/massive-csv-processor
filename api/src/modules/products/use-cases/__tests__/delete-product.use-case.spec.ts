import { DeleteProductUseCase } from '../delete-product.use-case';
import { ProductsInMemoryRepository } from '../../repositories/products-in-memory.respository';
import { ProductEntity } from '../../entities/product.entity';
import { NotFoundException } from '@nestjs/common';

describe('DeleteProductUseCase', () => {
  let useCase: DeleteProductUseCase;
  let repository: ProductsInMemoryRepository;

  beforeEach(() => {
    repository = new ProductsInMemoryRepository();
    useCase = new DeleteProductUseCase(repository);
  });

  it('should delete a product by id', async () => {
    // Primeiro criamos manualmente um produto
    const product = await repository.create(
      new ProductEntity({
        name: 'Test Product',
        price: 100,
        expiration: new Date(),
        exchange_rates: [],
      }),
    );

    const result = await useCase.execute(Number(product.id));

    expect(result).toBe(true);

    const found = await repository.findById(Number(product.id));
    expect(found).toBeNull();
  });

  it('should throw NotFoundException if product does not exist', async () => {
    await expect(useCase.execute(999)).rejects.toThrow(NotFoundException);
  });
});
