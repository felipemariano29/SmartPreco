import { S3UploadStrategy } from '@modules/upload/strategies/upload-s3.strategy';
import { SupabaseUploadStrategy } from '@modules/upload/strategies/upload-supabase.strategy';
import { UploadStrategyFactory } from '@modules/upload/strategies/upload.strategy.factory';
import { UploadController } from '@modules/upload/upload.controller';
import { UploadService } from '@modules/upload/upload.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [ UploadController ],
  providers: [
    UploadService,
    SupabaseUploadStrategy,
    S3UploadStrategy,
    UploadStrategyFactory,
    {
      provide: 'UploadStrategy',
      useFactory: (uploadStrategyFactory: UploadStrategyFactory) => {
        return uploadStrategyFactory.create();
      },
      inject: [ UploadStrategyFactory ],
    },
  ],
})
export class UploadModule {}
