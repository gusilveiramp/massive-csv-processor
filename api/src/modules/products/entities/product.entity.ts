import { ProductExchangeRateEntity } from './product-exchange-rate.entity';

export class ProductEntity {
  id?: number;
  name?: string | null;
  price?: number | null;
  expiration?: Date | null;
  created_at?: Date;
  updated_at?: Date | null;
  deleted_at?: Date | null;
  exchange_rates?: ProductExchangeRateEntity[] | null;

  constructor(partial: Partial<ProductEntity>) {
    // Pega todas as prorpiedades do objeto passado e copia para o objeto destino
    Object.assign(this, partial);
  }
}
