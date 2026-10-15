
import {
  Controller,
  Headers,
  Post,
  ServiceUnavailableException,
  UnauthorizedException,
} from '@nestjs/common';
import { ProductSyncService } from './product-sync.service';

@Controller('products/sync')
export class ProductSyncController {
  constructor(
    private readonly productSyncService: ProductSyncService,
  ) {}

  @Post('sheet')
  async syncSheet(
    @Headers('x-sync-secret') secret?: string,
  ) {
    const expectedSecret = process.env.PRODUCT_SYNC_SECRET;

    // Không mở API đồng bộ công khai khi chưa cấu hình secret.
    if (!expectedSecret) {
      throw new ServiceUnavailableException(
        'Chưa cấu hình PRODUCT_SYNC_SECRET.',
      );
    }

    if (!secret || secret !== expectedSecret) {
      throw new UnauthorizedException('Secret không hợp lệ.');
    }

    return {
      message: 'Đồng bộ Google Sheet hoàn tất.',
      data: await this.productSyncService.syncFromSheet(),
    };
  }
}
