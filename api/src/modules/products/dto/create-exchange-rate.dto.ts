import { IsNumber, IsOptional, IsString, Length } from 'class-validator';

export class CreateExchangeRateDto {
  @IsString()
  @Length(3, 3, { message: 'currency must be a 3-letter ISO code (e.g., USD)' })
  currency!: string;

  @IsNumber()
  exchange_rate!: number;

  @IsOptional()
  @IsNumber()
  converted_price?: number | null;
}
