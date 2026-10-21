import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';

import { FileModule } from './file/file.module';
import { ProductModule } from './product/product.module';
import { ProductImageModule } from './product-image/product-image.module';

import { databaseConfig } from './config/database.config';
import { getDatabaseEnvFilePath } from './config/database-profile';
import { SiteSettingModule } from './site-setting/site-setting.module';
import { ProductSyncModule } from './product-sync/product-sync.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getDatabaseEnvFilePath(),
    }),

    TypeOrmModule.forRoot(databaseConfig()),

    FileModule,
    ProductModule,
    ProductImageModule,
    SiteSettingModule,
    ProductSyncModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
