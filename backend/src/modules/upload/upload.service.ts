import { Inject, Injectable } from '@nestjs/common';

import { UploadImageDto } from './upload.dto';
import { UploadParams } from './upload.interface';
import { UploadStrategy } from './upload.strategy';
import { validateImageFile } from './upload.validator';

@Injectable()
export class UploadService implements UploadStrategy {

  public constructor(@Inject('UploadStrategy') private readonly strategy: UploadStrategy) {}

  public async uploadImage(file: Express.Multer.File): Promise<UploadImageDto> {
    validateImageFile(file);

    const params: UploadParams = {
      buffer: file.buffer,
      filename: file.originalname,
      mimetype: file.mimetype,
    };

    return this.strategy.uploadImage(params);
  }

}