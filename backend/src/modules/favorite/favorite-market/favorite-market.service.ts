import { Injectable } from '@nestjs/common';

import { ContextEnum } from '../../../shared/context/context.enum';
import { ContextService } from '../../../shared/context/context.service';
import { MarketDto } from '../../market/market.dto';
import { MarketService } from '../../market/market.service';
import { FavoriteStrategy } from '../favorite.strategy';
import { FavoriteMarketRepository } from './favorite-market.repository';

@Injectable()
export class FavoriteMarketService implements FavoriteStrategy {
  public constructor(
    private readonly contextService: ContextService,
    private readonly marketService: MarketService,
    private readonly favoriteMarketRepository: FavoriteMarketRepository,
  ) {}

  public async getFavorites(): Promise<MarketDto[]> {
    const userId = this.getUserId();

    const marketIds = await this.favoriteMarketRepository.findMarketIdsByUser(userId);

    const markets = await Promise.all(
      marketIds.map((id) => this.marketService.readMarketById(id)),
    );

    return markets;
  }

  public async favorite(marketId: string): Promise<void> {
    const userId = this.getUserId();

    await this.marketService.readMarketById(marketId);

    const alreadyFavorited = await this.favoriteMarketRepository.exists(userId, marketId);
    if (!alreadyFavorited) {
      await this.favoriteMarketRepository.insert(userId, marketId);
    }
  }

  public async unfavorite(marketId: string): Promise<void> {
    const userId = this.getUserId();

    await this.favoriteMarketRepository.delete(userId, marketId);
  }

  private getUserId(): string {
    return this.contextService.get(ContextEnum.USER).id;
  }
}