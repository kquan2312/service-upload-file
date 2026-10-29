import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ProductImage } from './entities/product-image.entity';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { FileService } from '../file/file.service';
import { ProductService } from '../product/product.service';
import { CreateProductDto } from '../product/dto/create-product.dto';

@Injectable()
export class ProductImageService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImageRepository: Repository<ProductImage>,

    private readonly fileService: FileService,
    private readonly productService: ProductService,
  ) {}

  async upsertProductWithImage(
    dto: CreateProductDto,
    file: Express.Multer.File,
    isThumbnail = true,
  ) {
    try {
      const { product, action } = await this.productService.upsert(dto);
      if (!product) {
        throw new NotFoundException('Product could not be created or updated');
      }

      const uploadResult: any = await this.fileService.upload(file);

    if (isThumbnail) {
      await this.productImageRepository.update(
        { productId: product.id, isThumbnail: true },
        { isThumbnail: false },
      );
    }

    const image = this.productImageRepository.create({
      productId: product.id,
      url: uploadResult.secure_url,
      isThumbnail,
    });

      return {
        action,
        product: await this.productService.findOne(product.id),
        image: await this.productImageRepository.save(image),
      };
    } catch (error) {
      console.error('upsertProductWithImage failed', error);
      throw error;
    }
  }

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
