import { IsString, IsNumber, IsOptional, IsISO8601 } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsOptional()
  name?: string | null;

  @IsNumber()
  @IsOptional()
  price?: number | null;

  @IsISO8601()
  @IsOptional()
  expiration?: Date | null;
}
