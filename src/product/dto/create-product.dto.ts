import {
  IsNumber,
  IsOptional,
  IsString,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';


export class ProductPriceDto {
  @IsOptional()
  @IsNumber()
  fes?: number | null;

  @IsOptional()
  @IsNumber()
  testShoot?: number | null;
}
export class CreateProductDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  ver?: string;

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => ProductPriceDto)
  price?: ProductPriceDto | null;

  @IsOptional()
  @IsString()
  size?: string;

  @IsOptional()
  @IsString()
  note?: string;
}