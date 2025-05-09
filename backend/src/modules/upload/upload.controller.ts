import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { UploadImageDto } from './upload.dto';
import { UploadService } from './upload.service';

@Controller('upload')
@ApiTags('Upload')
export class UploadController {

  public constructor(private readonly uploadService: UploadService) {}

  @Post('image')
  @HttpCode(HttpStatus.CREATED)
  @UseInterceptors(FileInterceptor('file', {
    limits: { fileSize: 200 * 1024 }, // 200KB
    fileFilter: (req, file, callback) => {
      const allowedTypes = [ 'image/png', 'image/jpeg' ];
      if (!allowedTypes.includes(file.mimetype)) {
        return callback(new Error('Only PNG and JPEG images are allowed'), false);
      }
      callback(null, true);
    },
  }))
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Uploads an image and returns the public URL' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
      },
    },
  })
  public async uploadImage(@UploadedFile() file: Express.Multer.File): Promise<UploadImageDto> {
    return this.uploadService.uploadImage(file);
  }

}