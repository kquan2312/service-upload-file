import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { SiteSettingService } from './site-setting.service';
import { CreateSiteSettingDto } from './dto/create-site-setting.dto';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';

@Controller('site-setting')
export class SiteSettingController {
  constructor(private readonly siteSettingService: SiteSettingService) {}

  @Post()
  @UseInterceptors(FileInterceptor('logo'))
  create(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateSiteSettingDto,
  ) {
    return this.siteSettingService.create(dto, file);
  }

  @Get()
  findOne() {
    return this.siteSettingService.findOne();
  }

  @Put(':id')
  @UseInterceptors(FileInterceptor('logo'))
  update(
    @Param('id') id: string,
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: UpdateSiteSettingDto,
  ) {
    return this.siteSettingService.update(id, dto, file);
  }
}