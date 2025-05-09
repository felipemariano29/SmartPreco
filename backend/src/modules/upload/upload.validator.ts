import { BadRequestException } from '@nestjs/common';

const allowedMimeTypes = [ 'image/png', 'image/jpeg' ];
const maxSizeInBytes = 50 * 1024 * 1024;

export function validateImageFile(file: Express.Multer.File): void {

  if (!file) {
    throw new BadRequestException('No file provided');
  }

  if (!allowedMimeTypes.includes(file.mimetype)) {
    throw new BadRequestException('Only PNG and JPEG images are allowed');
  }

  if (file.size > maxSizeInBytes) {
    throw new BadRequestException(`Image size exceeds the ${maxSizeInBytes / 1024 / 1024}MB limit`);
  }

}