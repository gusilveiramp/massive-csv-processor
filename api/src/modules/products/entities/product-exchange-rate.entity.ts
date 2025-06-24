export class ProductExchangeRateEntity {
  id?: number;
  product_id!: number;
  currency!: string;
  exchange_rate!: number;
  converted_price?: number | null;

  constructor(partial: Partial<ProductExchangeRateEntity>) {
    Object.assign(this, partial);
  }
}
