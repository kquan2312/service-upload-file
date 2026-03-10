import { Injectable, Inject } from '@nestjs/common';
import * as streamifier from 'streamifier';

@Injectable()
export class FileService {

  constructor(
    @Inject('CLOUDINARY') private readonly cloudinary: any,
  ) {}

  async upload(file: Express.Multer.File) {

    return new Promise((resolve, reject) => {

      const stream = this.cloudinary.uploader.upload_stream(
        {
          folder: 'documents',
          resource_type: 'auto'
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(stream);

    });

  }

}