import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { ProductEntity } from '../entities/product.entity';
import { ProductExchangeRateEntity } from '../entities/product-exchange-rate.entity';
import { CreateProductWithExchangeRatesDto } from '../dto/create-product-with-exchange-rates.dto';

@Injectable()
export class CreateProductsChunkUseCase {
  constructor(private readonly productsRepository: ProductsRepository) {}

  async execute(products: CreateProductWithExchangeRatesDto[]) {
    if (!products.length) return;

    const productEntities = products.map(
      (p) =>
        new ProductEntity({
          name: p.name,
          price: p.price,
          expiration: p.expiration,
          exchange_rates: p.exchange_rates?.map(
            (rate) =>
              new ProductExchangeRateEntity({
                currency: rate.currency,
                exchange_rate: rate.exchange_rate,
                converted_price: rate.converted_price,
              }),
          ),
        }),
    );

    await this.productsRepository.createMany(productEntities);
  }
}
