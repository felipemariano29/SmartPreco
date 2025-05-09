import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { Express } from 'express';

import { UploadImageDto } from './upload.dto';
import { UploadParams } from './upload.interface';
import { UploadStrategy } from './upload.strategy';

@Injectable()
export class UploadService implements UploadStrategy {

  public constructor(
    @Inject('UploadStrategy')
    private readonly strategy: UploadStrategy,
  ) {}

  public async uploadImage(file: Express.Multer.File): Promise<UploadImageDto> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const allowedMimeTypes = [ 'image/png', 'image/jpeg' ];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      throw new BadRequestException('Only PNG and JPEG images are allowed');
    }

    const maxSizeInBytes = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSizeInBytes) {
      throw new BadRequestException('Image size exceeds the 50MB limit');
    }

    const params: UploadParams = {
      buffer: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype,
    };

    const imageUrl = await this.strategy.uploadImage(params);

    return imageUrl;
  }
}