import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { SiteSetting } from './entities/site-setting.entity';
import { CreateSiteSettingDto } from './dto/create-site-setting.dto';
import { UpdateSiteSettingDto } from './dto/update-site-setting.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class SiteSettingService {
  constructor(
    @InjectRepository(SiteSetting)
    private readonly siteSettingRepository: Repository<SiteSetting>,

    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateSiteSettingDto,
    file?: Express.Multer.File,
  ) {
    // Website chỉ có 1 setting
    const existing = await this.siteSettingRepository.findOne({
      where: {},
    });

    if (existing) {
      throw new BadRequestException(
        'Site setting already exists. Please use PUT to update.',
      );
    }

    let logo: string | null = null;

    if (file) {
      const result = await this.fileService.upload(file); 
      logo = (result as any).secure_url;
    }

    const setting = this.siteSettingRepository.create({
      ...dto,
      logo,
    });

    return this.siteSettingRepository.save(setting);
  }

  async findOne() {
    return this.siteSettingRepository.findOne({
      where: {},
    });
  }

  async update(
    id: string,
    dto: UpdateSiteSettingDto,
    file?: Express.Multer.File,
  ) {
    const setting = await this.siteSettingRepository.findOne({
      where: { id },
    });

    if (!setting) {
      throw new NotFoundException('Site setting not found');
    }

    // Nếu có upload ảnh mới thì thay URL
    if (file) {
      const result = await this.fileService.upload(file);

      setting.logo = (result as any).secure_url;
    }

    Object.assign(setting, dto);

    return this.siteSettingRepository.save(setting);
  }
}