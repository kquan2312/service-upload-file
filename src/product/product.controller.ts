import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
  ) {}

  @Post()
  create(
    @Body() dto: CreateProductDto,
  ) {
    return this.productService.create(dto);
  }

  @Put('upsert')
  upsert(@Body() dto: CreateProductDto) {
    return this.productService.upsert(dto);
  }

  @Get()
findAll(
  @Query('type') type?: string,
  @Query('search') search?: string,
  @Query('page') page?: string,
  @Query('limit') limit?: string,
) {
  return this.productService.findAll(type, search ,  Number(page) || 1,
    Number(limit) || 12,);
}

  @Get(':id')
  findOne(
    @Param('id') id: string,
  ) {
    return this.productService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  remove(
    @Param('id') id: string,
  ) {
    return this.productService.remove(id);
  }
}
