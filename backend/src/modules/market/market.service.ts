import { Injectable } from '@nestjs/common';

import { DtoMapper } from '../../shared/utils/dto-mapper';
import { MarketCreateDto, MarketDto, MarketReadDto, MarketsDto, MarketTimestampDto, MarketUpdateDto } from './market.dto';
import { MarketRepository } from './market.repository';

@Injectable()
export class MarketService {

  public constructor(private readonly marketRepository: MarketRepository) {}

  public async createMarket(params: MarketCreateDto): Promise<MarketDto> {
    const market = await this.marketRepository.createMarket(params);

    return DtoMapper.mapOne(market, this.toDto);
  }

  public async readMarkets(params: MarketReadDto): Promise<MarketsDto> {
    const markets = await this.marketRepository.readMarkets(params);

    return { markets: DtoMapper.mapMany(markets, this.toDto) };
  }

  public async readMarketById(marketId: string): Promise<MarketDto> {
    const market = await this.marketRepository.readMarketById(marketId);

    return DtoMapper.mapOne(market, this.toDto);
  }

  public async updateMarketById(marketId: string, dto: MarketUpdateDto): Promise<MarketDto> {
    const market = await this.marketRepository.updateMarketById(marketId, dto);

    return DtoMapper.mapOne(market, this.toDto);
  }

  public async deleteMarketById(marketId: string): Promise<void> {
    await this.marketRepository.deleteMarketById(marketId);
  }

  private toDto(market: MarketTimestampDto): MarketDto {
    const { id, name, address, city, state } = market;
    return { id, name, address, city, state };
  }

}