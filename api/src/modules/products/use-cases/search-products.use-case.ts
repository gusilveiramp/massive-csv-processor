import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { SearchProductsDto } from '../dto/search-products.dto';

@Injectable()
export class SearchProductsUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute({ search, page, limit }: SearchProductsDto) {
    return this.productsRepository.search(search, page, limit);
  }
}
