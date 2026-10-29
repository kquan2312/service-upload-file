import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProductImageService } from './product-image.service';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { CreateProductDto } from '../product/dto/create-product.dto';

@Controller('product-images')
export class ProductImageController {
  constructor(
    private readonly productImageService: ProductImageService,
  ) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  create(
  @UploadedFile() file: Express.Multer.File,
  @Body() dto: CreateProductImageDto,
) {
  return this.productImageService.create(dto, file);
}

  @Get()
  findAll() {
    return this.productImageService.findAll();
  }

  @Post('upsert-product')
  @UseInterceptors(FileInterceptor('file'))
  upsertProductWithImage(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: Record<string, string>,
  ) {
    const dto: CreateProductDto = {
      name: body.name,
      ver: body.ver || undefined,
      type: body.type || undefined,
      size: body.size || undefined,
      note: body.note || undefined,
      price: {
        fes: body.priceFes === undefined || body.priceFes === '' ? undefined : Number(body.priceFes),
        testShoot: body.priceTestShoot === undefined || body.priceTestShoot === '' ? undefined : Number(body.priceTestShoot),
      },
    };

    return this.productImageService.upsertProductWithImage(
      dto,
      file,
      body.isThumbnail !== 'false',
    );
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.productImageService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductImageDto,
  ) {
    return this.productImageService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.productImageService.remove(id);
  }
}
