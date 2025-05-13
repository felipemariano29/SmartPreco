import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { UploadStrategy } from '@modules/upload/strategies/upload.strategy';
import { UploadImageDto } from '@modules/upload/upload.dto';
import { UploadParams } from '@modules/upload/upload.interface';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class S3UploadStrategy implements UploadStrategy {
  private readonly bucket: string;
  private readonly s3: S3Client;

  public constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('S3_BUCKET')!;
    this.s3 = new S3Client({
      region: this.config.get<string>('S3_REGION')!,
      credentials: {
        accessKeyId: this.config.get<string>('S3_ACCESS_KEY_ID')!,
        secretAccessKey: this.config.get<string>('S3_SECRET_ACCESS_KEY')!,
      },
      endpoint: this.config.get<string>('S3_ENDPOINT') ?? undefined, // opcional
      forcePathStyle: true,
    });
  }

  public async uploadImage({ buffer, filename, mimetype }: UploadParams): Promise<UploadImageDto> {
    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: filename,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
      }),
    );

    const baseUrl = this.config.get<string>('S3_ENDPOINT')?.replace(/\/$/, '') ?? `https://${this.bucket}.s3.amazonaws.com`;

    return { imageUrl: `${baseUrl}/${filename}` };
  }
}