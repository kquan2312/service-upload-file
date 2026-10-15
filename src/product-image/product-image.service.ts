import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductImage } from './entities/product-image.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { FileService } from '../file/file.service';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly fileService: FileService,
  ) {}

  async create(
    dto: CreateProductImageDto,
    file: Express.Multer.File,
  ) {

    const uploadResult: any =
      await this.fileService.upload(file);

    const image = this.productImageRepository.create({
      productId: dto.productId,
      url: uploadResult.secure_url,
      isThumbnail: dto.isThumbnail ?? false,
    });

    return this.productImageRepository.save(image);
  }


  findAll() {
    return this.productImageRepository.find({
      relations: {
        product: true,
      },
    });
  }


  async findOne(id: string) {
    const image = await this.productImageRepository.findOne({
      where: { id },
      relations: {
        product: true,
      },
    });

    if (!image) {
      throw new NotFoundException(
        'Product image not found',
      );
    }

    return image;
  }


  async update(
    id: string,
    dto: UpdateProductImageDto,
  ) {
    await this.productImageRepository.update(id, dto);

    return this.findOne(id);
  }


  async remove(id: string) {
    const image = await this.findOne(id);

    await this.productImageRepository.remove(image);

    return {
      message: 'Delete success',
    };
  }
}