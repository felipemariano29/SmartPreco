import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FavoriteProductIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Product's unique identifier",
    example: '3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d',
  })
  public productId: string;

}