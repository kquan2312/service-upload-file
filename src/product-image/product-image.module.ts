import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ProductImageController } from './product-image.controller';
import { ProductImageService } from './product-image.service';
import { ProductImage } from './entities/product-image.entity';
import { ProductModule } from '../product/product.module';

import { FileModule } from '../file/file.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ProductImage,
    ]),
    FileModule,
    ProductModule,
  ],

  controllers: [
    ProductImageController,
  ],

  providers: [
    ProductImageService,
  ],

  exports: [
    ProductImageService,
  ],
})
export class ProductImageModule {}
