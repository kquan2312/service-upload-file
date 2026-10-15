
import {
  BadGatewayException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { parse } from 'csv-parse/sync';
import { Product } from '../product/entities/product.entity';
import { google } from 'googleapis';


type SheetProduct = {
  name: string;
  ver: string | null;
};


type SyncResult = {
  sheetRows: number;
  dbRowsBefore: number;
  dbRowsAfter: number;

  created: number;
  updated: number;
  skipped: number;
  deactivated: number;
  reactivated: number;

  versionsAdded: number;
  versionsRemoved: number;

  changes: {
    productsAdded: string[];
    productsUpdated: string[];
    productsDeactivated: string[];
    productsReactivated: string[];
    versionsAdded: string[];
    versionsRemoved: string[];
  };
};


@Injectable()
export class ProductSyncService {
  private readonly logger = new Logger(ProductSyncService.name);

  private readonly csvUrl =
    process.env.GOOGLE_SHEET_CSV_URL ??
    'https://docs.google.com/spreadsheets/d/1MSs9Dnna85ZvrGhjtLBm3FvUMMgV11kuDDSEZehUyoM/export?format=csv&gid=796974677';

  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  private normalize(value: string | null | undefined): string {
    return (value ?? '')
      .normalize('NFC')
      .trim()
      .replace(/\s+/g, ' ')
      .toLocaleLowerCase('vi');
  }

  private makeKey(name: string, ver: string | null): string {
    return `${this.normalize(name)}::${this.normalize(ver)}`;
  }

  private parseProductName(rawValue: string): SheetProduct | null {
    const value = rawValue
      .replace(/^\uFEFF/, '')
      .trim();

    if (!value) {
      return null;
    }

    const separatorIndex = value.indexOf('|');

    if (separatorIndex === -1) {
      return {
        name: value,
        ver: null,
      };
    }

    const name = value.slice(0, separatorIndex).trim();
    const ver = value.slice(separatorIndex + 1).trim();

    if (!name) {
      return null;
    }

    return {
      name,
      ver: ver || null,
    };
  }

 

private async fetchSheetProducts(): Promise<SheetProduct[]> {
  const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
    scopes: [
      'https://www.googleapis.com/auth/spreadsheets.readonly',
    ],
  });

  const sheets = google.sheets({
    version: 'v4',
    auth,
  });

  let response;

  try {
    response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE ?? 'DsThue!A:A',
    });
  } catch (error) {
    this.logger.error(
      'Không đọc được Google Sheet',
      error instanceof Error ? error.message : String(error),
    );

    throw new BadGatewayException(
      'Không thể đọc tab DsThue. Kiểm tra quyền truy cập, Sheet ID và cấu hình Service Account.',
    );
  }

  const rows = response.data.values ?? [];
  const products: SheetProduct[] = [];

  for (const row of rows) {
    const rawValue = String(row[0] ?? '').trim();

    if (
      !rawValue ||
      ['name', 'tên', 'tên nhân vật', 'character']
        .includes(this.normalize(rawValue))
    ) {
      continue;
    }

    const product = this.parseProductName(rawValue);

    if (product) {
      products.push(product);
    }
  }

  if (products.length === 0) {
    throw new BadGatewayException(
      'Tab DsThue cột A không có sản phẩm hợp lệ. Đã hủy đồng bộ.',
    );
  }

  return products;
}


  
async syncFromSheet(): Promise<SyncResult> {
  const sheetProducts = await this.fetchSheetProducts();
  const existingProducts = await this.productRepository.find();

  const result: SyncResult = {
    sheetRows: sheetProducts.length,
    dbRowsBefore: existingProducts.length,
    dbRowsAfter: 0,
    created: 0,
    updated: 0,
    skipped: 0,
    deactivated: 0,
    reactivated: 0,
    versionsAdded: 0,
    versionsRemoved: 0,
    changes: {
      productsAdded: [],
      productsUpdated: [],
      productsDeactivated: [],
      productsReactivated: [],
      versionsAdded: [],
      versionsRemoved: [],
    },
  };

  const display = (name: string, ver: string | null) =>
    ver ? `${name} | ${ver}` : `${name} | (ver: null)`;

  const existingByKey = new Map<string, Product>();

  for (const product of existingProducts) {
    const key = this.makeKey(product.name, product.ver);

    if (!existingByKey.has(key)) {
      existingByKey.set(key, product);
    }
  }

  // Loại bỏ các cặp name + ver bị trùng trong Sheet.
  const uniqueSheetProducts = new Map<string, SheetProduct>();

  for (const item of sheetProducts) {
    const key = this.makeKey(item.name, item.ver);

    if (!uniqueSheetProducts.has(key)) {
      uniqueSheetProducts.set(key, item);
    }
  }

  const sheetKeys = new Set(uniqueSheetProducts.keys());

  // Chỉ tính những bản ghi đang active để phát hiện mục bị bỏ khỏi Sheet.
  const activeBefore = new Map<string, Product>();

  for (const product of existingProducts) {
    if (product.isActive) {
      const key = this.makeKey(product.name, product.ver);

      if (!activeBefore.has(key)) {
        activeBefore.set(key, product);
      }
    }
  }

  // Tính chênh lệch phiên bản trước khi cập nhật DB.
  for (const [key, item] of uniqueSheetProducts) {
    const existing = existingByKey.get(key);

    if (!existing) {
      result.versionsAdded++;
      result.changes.versionsAdded.push(display(item.name, item.ver));
    }
  }

  for (const [key, product] of activeBefore) {
    if (!sheetKeys.has(key)) {
      result.versionsRemoved++;
      result.changes.versionsRemoved.push(
        display(product.name, product.ver),
      );
    }
  }

  for (const [key, item] of uniqueSheetProducts) {
    const existing = existingByKey.get(key);

    if (!existing) {
      const newProduct = this.productRepository.create({
        name: item.name,
        ver: item.ver,
        isActive: true,
      });

      await this.productRepository.save(newProduct);

      result.created++;
      result.changes.productsAdded.push(display(item.name, item.ver));
      continue;
    }

    let changed = false;

    // Chỉ cập nhật name và ver.
    if (existing.name !== item.name) {
      existing.name = item.name;
      changed = true;
    }

    if (existing.ver !== item.ver) {
      existing.ver = item.ver;
      changed = true;
    }

    if (!existing.isActive) {
      existing.isActive = true;
      result.reactivated++;
      result.changes.productsReactivated.push(
        display(item.name, item.ver),
      );
      changed = true;
    }

    if (changed) {
      await this.productRepository.save(existing);

      if (
        existing.name !== item.name ||
        existing.ver !== item.ver
      ) {
        result.updated++;
        result.changes.productsUpdated.push(
          display(item.name, item.ver),
        );
      }
    } else {
      result.skipped++;
    }
  }

  // Các sản phẩm active không còn trong Sheet sẽ chuyển inactive.
  for (const product of existingProducts) {
    const key = this.makeKey(product.name, product.ver);

    if (!sheetKeys.has(key) && product.isActive) {
      product.isActive = false;
      await this.productRepository.save(product);

      result.deactivated++;
      result.changes.productsDeactivated.push(
        display(product.name, product.ver),
      );
    }
  }

  result.dbRowsAfter = await this.productRepository.count();

  this.logger.log(
    `PRODUCT SYNC REPORT\n${JSON.stringify(result, null, 2)}`,
  );

  return result;
}

}
