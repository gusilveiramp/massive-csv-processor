import {
  IsString,
  IsNumber,
  IsOptional,
  IsISO8601,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { CreateExchangeRateDto } from './create-exchange-rate.dto';

export class CreateProductWithExchangeRatesDto {
  @IsString()
  @IsOptional()
  name?: string | null;

  @IsNumber()
  @IsOptional()
  price?: number | null;

  @IsISO8601()
  @IsOptional()
  expiration?: Date | null;

  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateExchangeRateDto)
  exchange_rates?: CreateExchangeRateDto[];
}
