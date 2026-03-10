import { Module } from '@nestjs/common';
import { FileService } from './file.service';
import { CloudinaryProvider } from 'src/config/cloudinary.config';
import { FileController } from './file.controller';

@Module({
  controllers: [FileController],
  providers: [FileService, CloudinaryProvider],
  exports: [FileService],
})
export class FileModule {}