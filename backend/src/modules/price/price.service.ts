/* eslint-disable camelcase */
import { Injectable } from '@nestjs/common';

import { ContextEnum } from '../../shared/context/context.enum';
import { ContextService } from '../../shared/context/context.service';
import { DtoMapper } from '../../shared/utils/dto-mapper';
import { PriceCreateDto, PriceDto, PriceReadDto, PricesDto, PriceTimestampDto } from './price.dto';
import { PriceRepository } from './price.repository';

@Injectable()
export class PriceService {
  public constructor(
    private readonly priceRepository: PriceRepository,
    private readonly contextService: ContextService,
  ) {}

  public async createPrice(params: PriceCreateDto): Promise<PriceDto> {
    const { id } = this.contextService.get(ContextEnum.USER);

    const { marketId, productId, price, imageUrl } = params;

    const createdPrice = await this.priceRepository.createPrice({
      user_id: id,
      product_id: productId,
      market_id: marketId,
      image_url: imageUrl,
      price,
      moderated: true
    });

    return DtoMapper.mapOne(createdPrice, this.toDto);
  }

  public async readPrices(params: PriceReadDto): Promise<PricesDto> {
    const { records, total } = await this.priceRepository.readPrices(params);

    const offset = params.offset ?? 0;
    const limit = params.limit ?? 20;

    return {
      records: DtoMapper.mapMany(records, this.toDto),
      count: records.length,
      total,
      nextOffset: (offset + limit) < total ? offset + limit : null,
    };
  }

  private toDto(params: PriceTimestampDto): PriceDto {
    const { id, market, product, price, imageUrl, userId, moderated } = params;
    return { id, market, product, price, imageUrl, userId, moderated };
  }

  public async updateModeratedFlag(priceId: string, moderated: boolean): Promise<void> {
    await this.priceRepository.updatePriceById(priceId, { moderated });
  }

}