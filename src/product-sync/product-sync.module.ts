
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entities/product.entity';

import { ProductSyncController } from './product-sync.controller';
import { ProductSyncService } from './product-sync.service';

@Module({
  imports: [TypeOrmModule.forFeature([Product])],
  controllers: [ProductSyncController],
  providers: [ProductSyncService],
  exports: [ProductSyncService],
})
export class ProductSyncModule {}
