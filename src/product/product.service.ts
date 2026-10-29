import { ConflictException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Product, ProductPrice } from './entities/product.entity';
import { CreateProductDto, ProductPriceDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private normalizeIdentity(value: string | null | undefined): string {
    return (value ?? '')
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, ' ')
      .toLocaleLowerCase('vi');
  }

  private identity(name: string, ver?: string | null): string {
    return `${this.normalizeIdentity(name)}::${this.normalizeIdentity(ver)}`;
  }

  private async findByIdentity(name: string, ver?: string | null) {
    const products = await this.productRepository.find();
    const key = this.identity(name, ver);

    return products.find((product) => this.identity(product.name, product.ver) === key);
  }

  async create(dto: CreateProductDto) {
    const duplicate = await this.findByIdentity(dto.name, dto.ver);

    if (duplicate) {
      throw new ConflictException(
        `Sản phẩm đã tồn tại: ${duplicate.name}${duplicate.ver ? ` | ${duplicate.ver}` : ''}`,
      );
    }

    const product = this.productRepository.create({
      ...dto,
      ...(dto.price !== undefined
        ? { price: this.normalizePrice(dto.price) }
        : {}),
    });

    return this.productRepository.save(product);
  }

  async upsert(dto: CreateProductDto) {
    const existing = await this.findByIdentity(dto.name, dto.ver);

    if (!existing) {
      return { action: 'created' as const, product: await this.create(dto) };
    }

    return { action: 'updated' as const, product: await this.update(existing.id, dto) };
  }

  private normalizePrice(
    price: ProductPriceDto | null,
    current?: ProductPrice | null,
  ): ProductPrice | null {
    if (price === null) {
      return null;
    }

    return {
      fes: price.fes !== undefined ? price.fes : (current?.fes ?? null),
      testShoot:
        price.testShoot !== undefined
          ? price.testShoot
          : (current?.testShoot ?? null),
    };
  }

  async findAll(type?: string, search?: string, page = 1, limit = 12) {
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
    let update = dto;

    if (dto.price && typeof dto.price === 'object') {
      const current = await this.productRepository.findOneBy({ id });
      update = {
        ...dto,
        price: this.normalizePrice(dto.price, current?.price),
      };
    }

    await this.productRepository.update(id, update);

    return this.findOne(id);
  }

  async remove(id: string) {
    await this.productRepository.delete(id);

    return {
      message: 'Delete success',
    };
  }
}
