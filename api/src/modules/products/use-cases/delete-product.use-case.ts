import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class DeleteProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: number): Promise<boolean> {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException();
    return this.productsRepository.delete(id);
  }
}
