import { Injectable } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { CreateProductDto } from '../dto/create-product.dto';
import { ProductEntity } from '../entities/product.entity';
import { ProductExchangeRateEntity } from '../entities/product-exchange-rate.entity';
import { EnvService } from '../../../infra/env/env.service';
import { CurrencyService } from '../../currency/currency.service';

@Injectable()
export class CreateProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly currencyService: CurrencyService,
    private readonly envService: EnvService,
  ) {}

  async execute(data: CreateProductDto): Promise<ProductEntity> {
    const baseCurrency = this.envService.get('CURRENCY_BASE');
    const targetCurrencies = this.envService.get('CURRENCY_TARGETS');

    const exchangeRates = await this.currencyService.getExchangeRates(
      baseCurrency,
      targetCurrencies,
    );

    const exchangeRateEntities = Object.entries(exchangeRates).map(
      ([currency, rate]) =>
        new ProductExchangeRateEntity({
          currency,
          exchange_rate: rate,
          converted_price: data.price ? data.price * rate : null,
        }),
    );

    const productEntity = new ProductEntity({
      name: data.name,
      price: data.price,
      expiration: data.expiration,
      exchange_rates: exchangeRateEntities.map(
        (rate) => new ProductExchangeRateEntity(rate),
      ),
    });

    return this.productsRepository.create(productEntity);
  }
}
