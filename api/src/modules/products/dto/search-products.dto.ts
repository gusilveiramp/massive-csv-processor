import { IsOptional, IsString, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchProductsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  page!: number;

  @IsInt()
  @Type(() => Number)
  @Min(1)
  limit!: number;
}
