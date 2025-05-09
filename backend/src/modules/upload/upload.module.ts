import { Logger, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { S3UploadStrategy } from './upload-s3.strategy';
import { SupabaseUploadStrategy } from './upload-supabase.strategy';

@Module({
  controllers: [ UploadController ],
  providers: [
    UploadService,
    SupabaseUploadStrategy,
    S3UploadStrategy,
    {
      provide: 'UploadStrategy',
      useFactory: (config: ConfigService) => {
        const driver = config.get<string>('UPLOAD_DRIVER');
        const logger = new Logger();

        logger.debug(`Upload configured with ${driver.toUpperCase()}! 🚀`);

        return driver === 's3'
          ? new S3UploadStrategy(config)
          : new SupabaseUploadStrategy(config);
      },
      inject: [ ConfigService ],
    },
  ],
})
export class UploadModule {}
