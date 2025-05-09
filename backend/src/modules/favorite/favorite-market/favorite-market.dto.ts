import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class FavoriteMarketIdDto {

  @IsUUID()
  @ApiProperty({
    description: "Market's unique identifier",
    example: '3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d',
  })
  public marketId: string;

}