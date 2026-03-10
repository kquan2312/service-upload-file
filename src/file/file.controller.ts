import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';

import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileService } from './file.service';

@Controller('files')
export class FileController {

  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage()
    })
  )
  async upload(@UploadedFile() file: Express.Multer.File) {

    const result: any = await this.fileService.upload(file);

    return {
      url: result.secure_url,
      publicId: result.public_id
    };

  }

}