import { MarketDto, MarketIdDto, MarketRepositoryIdDto } from '@modules/market/market.dto';
import { ProductDto, ProductIdDto, ProductRepositoryIdDto } from '@modules/product/product.dto';
import { UploadImageDto, UploadImageRepositoryDto } from '@modules/upload/upload.dto';
import { ApiProperty, IntersectionType, OmitType, PartialType, PickType } from '@nestjs/swagger';
import { UserIdDto, UserIdRepositoryDto } from '@shared/user/user.dto';
import { PaginationReadDto, PaginationResponseDto } from '@shared/utils/pagination.dto';
import { TimestampDto, TimestampRepositoryDto } from '@shared/utils/timestamp.dto';
import { IsArray, IsBoolean, IsNumber, IsObject, IsUUID } from 'class-validator';

// == ID DTOs ==

export class PriceIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the price entry",
    example: "7a6d1e8f-5c4d-4b9e-8c7d-1e5d8c7f5c4d",
  })
  public priceId: string;
}

export class PriceRepositoryIdDto {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier for the price entry in the repository layer",
    example: "7a6d1e8f-5c4d-4b9e-8c7d-1e5d8c7f5c4d",
  })
  public price_id: string;
}

// == Main DTO ==

export class PriceDto extends IntersectionType(
  UploadImageDto,
  UserIdDto,
  PickType(TimestampDto, [ 'updatedAt' ] as const)
) {
  @IsUUID()
  @ApiProperty({
    description: "Unique identifier of the price entry",
    example: "7a6d1e8f-5c4d-4b9e-8c7d-1e5d8c7f5c4d",
  })
  public id: string;

  @IsNumber()
  @ApiProperty({
    description: "Product price value",
    example: 29.99,
  })
  public price: number;

  @IsBoolean()
  @ApiProperty({
    description: "Indicates if the price was moderated (approved for public listing)",
    example: true,
  })
  public moderated: boolean;

  @IsObject()
  @ApiProperty({ type: () => ProductDto })
  public product: ProductDto;

  @IsObject()
  @ApiProperty({ type: () => MarketDto })
  public market: MarketDto;
}

// == Repository DTOs ==

export class PriceCreateRepositoryDto extends IntersectionType(
  UserIdRepositoryDto,
  ProductRepositoryIdDto,
  MarketRepositoryIdDto,
  UploadImageRepositoryDto,
  PickType(PriceDto, [ 'price', 'moderated' ] as const)
) {}

export class PriceTimestampDto extends IntersectionType(
  OmitType(PriceDto, [ 'updatedAt' ] as const),
  TimestampRepositoryDto
) {}

// == Input DTOs ==

export class PriceReadDto extends IntersectionType(
  PaginationReadDto,
  PartialType(ProductIdDto),
  PartialType(MarketIdDto),
) {
  @ApiProperty({
    description: "Optional product ID to filter prices",
    example: "3d5d1d6d-3d5d-1d6d-3d5d-1d6d3d5d1d6d",
    required: false,
  })
  public productId?: string;

  @ApiProperty({
    description: "Optional market ID to filter prices",
    example: "5e7d1d6d-9f5b-4e2a-9c5b-1d6f3d5e9f5b",
    required: false,
  })
  public marketId?: string;
}

export class PriceCreateDto extends IntersectionType(
  ProductIdDto,
  MarketIdDto,
  UploadImageDto,
  PickType(PriceDto, [ 'price' ] as const)
) {}

export class PriceUpdateDto extends PartialType(IntersectionType(
  PriceCreateDto,
  PickType(PriceDto, [ 'moderated' ] as const)
)) {}

// == Pagination DTOs ==

export class PricesDto extends PaginationResponseDto<PriceDto> {
  @IsArray()
  @ApiProperty({
    description: 'List of price entries returned in the current page',
    type: [ PriceDto ],
  })
  public records: PriceDto[];
}

export class PricesTimestampDto extends PickType(PaginationResponseDto, [ 'total' ] as const) {
  @IsArray()
  @ApiProperty({
    description: 'List of price entries with repository-formatted timestamps',
    isArray: true,
    type: [ PriceTimestampDto ],
  })
  public records: PriceTimestampDto[];
}
