import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';

@Injectable()
export class FindProductUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(id: number) {
    const product = await this.productsRepository.findById(id);
    if (!product) {
      throw new NotFoundException();
    }
    return product;
  }
}
