import { UploadStrategy } from '@modules/upload/strategies/upload.strategy';
import { UploadImageDto } from '@modules/upload/upload.dto';
import { UploadParams } from '@modules/upload/upload.interface';
import { validateImageFile } from '@modules/upload/upload.validator';
import { Inject, Injectable } from '@nestjs/common';

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