import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product } from './entities/product.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  create(dto: CreateProductDto) {
    const product = this.productRepository.create(dto);

    return this.productRepository.save(product);
  }

async findAll(
  type?: string,
  search?: string,
  page = 1,
  limit = 12,
) {
  const query = this.productRepository
    .createQueryBuilder('product')
    .leftJoinAndSelect(
      'product.images',
      'image',
      'image.isThumbnail = :isThumbnail',
      {
        isThumbnail: true,
      },
    );

  if (type) {
    query.andWhere('product.type = :type', { type });
  }

  if (search) {
    query.andWhere(
      '(product.name ILIKE :search OR product.ver ILIKE :search)',
      {
        search: `%${search}%`,
      },
    );
  }

  const [data, total] = await query
    .orderBy('product.name', 'ASC')
    .skip((page - 1) * limit)
    .take(limit)
    .getManyAndCount();
console.log(data[0]);
  return {
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
}

 findOne(id: string) {
  return this.productRepository.findOne({
    where: { id },
    relations: {
      images: true,
    },
  });
}

  async update(id: string, dto: UpdateProductDto) {
    await this.productRepository.update(id, dto);

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.productRepository.delete(id);

    return {
      message: 'Delete success',
    };
  }
}