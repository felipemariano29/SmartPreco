import { PutObjectCommand,S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UploadImageDto } from './upload.dto';
import { UploadParams } from './upload.interface';
import { UploadStrategy } from './upload.strategy';

@Injectable()
export class SupabaseUploadStrategy implements UploadStrategy {
  private readonly bucket: string;
  private readonly s3: S3Client;

  public constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('SUPABASE_BUCKET')!;
    this.s3 = new S3Client({
      region: this.config.get<string>('SUPABASE_S3_REGION')!,
      endpoint: this.config.get<string>('SUPABASE_S3_ENDPOINT')!,
      forcePathStyle: true,
      credentials: {
        accessKeyId: this.config.get<string>('SUPABASE_STORAGE_KEY_ID')!,
        secretAccessKey: this.config.get<string>('SUPABASE_STORAGE_KEY_SECRET')!,
      },
    });
  }

  public async uploadImage({ buffer, filename, mimetype }: UploadParams): Promise<UploadImageDto> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ContentType: mimetype,
      }),
    );

    const baseUrl = this.config.get<string>('SUPABASE_URL')!;

    return { imageUrl: `${baseUrl}/storage/v1/object/public/${this.bucket}/${filename}` };
  }
}