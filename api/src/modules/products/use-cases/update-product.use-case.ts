import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository } from '../repositories/products.repository';
import { UpdateProductDto } from '../dto/update-product.dto';
import { EnvService } from '../../../infra/env/env.service';
import { CurrencyService } from '../../currency/currency.service';
import { ProductExchangeRateEntity } from '../entities/product-exchange-rate.entity';
import { ProductEntity } from '../entities/product.entity';

@Injectable()
export class UpdateProductUseCase {
  constructor(
    private readonly productsRepository: ProductsRepository,
    private readonly currencyService: CurrencyService,
    private readonly envService: EnvService,
  ) {}

  async execute(id: number, data: UpdateProductDto) {
    const product = await this.productsRepository.findById(id);
    if (!product) throw new NotFoundException('Product not found');

    const baseCurrency = this.envService.get('CURRENCY_BASE');
    const targetCurrencies = this.envService.get('CURRENCY_TARGETS');

    const exchangeRates = await this.currencyService.getExchangeRates(
      baseCurrency,
      targetCurrencies,
    );

    const updatedProduct = new ProductEntity({
      ...product,
      name: data.name ?? product.name,
      price: data.price ?? product.price,
      expiration: data.expiration ?? product.expiration,
      exchange_rates: Object.entries(exchangeRates).map(
        ([currency, exchange_rate]) =>
          new ProductExchangeRateEntity({
            currency,
            exchange_rate,
            converted_price:
              (data.price ?? product.price) != null
                ? (data.price ?? product.price)! * exchange_rate
                : null,
          }),
      ),
    });

    return this.productsRepository.update(id, updatedProduct);
  }
}
