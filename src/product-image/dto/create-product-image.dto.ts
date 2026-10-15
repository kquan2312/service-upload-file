import {
  IsBoolean,
  IsOptional,
  IsUUID,
} from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateProductImageDto {

  @IsUUID()
  productId: string;

  @IsOptional()
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  isThumbnail?: boolean;

}