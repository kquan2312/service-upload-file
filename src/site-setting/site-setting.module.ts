import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SiteSetting } from './entities/site-setting.entity';
import { SiteSettingController } from './site-setting.controller';
import { SiteSettingService } from './site-setting.service';
import { FileModule } from '../file/file.module';

@Module({
  imports: [TypeOrmModule.forFeature([SiteSetting]), FileModule],
  controllers: [SiteSettingController],
  providers: [SiteSettingService],
  exports: [SiteSettingService],
})
export class SiteSettingModule {}