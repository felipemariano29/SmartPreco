import { Module } from '@nestjs/common';

import { MarketModule } from '../market/market.module';
import { ProductModule } from '../product/product.module';
import { FavoriteStrategyToken } from './favorite.strategy';
import { FavoriteMarketController } from './favorite-market/favorite-market.controller';
import { FavoriteMarketRepository } from './favorite-market/favorite-market.repository';
import { FavoriteMarketService } from './favorite-market/favorite-market.service';
import { FavoriteProductController } from './favorite-product/favorite-product.controller';
import { FavoriteProductRepository } from './favorite-product/favorite-product.repository';
import { FavoriteProductService } from './favorite-product/favorite-product.service';

@Module({
  imports: [
    ProductModule,
    MarketModule,
  ],
  controllers: [
    FavoriteProductController,
    FavoriteMarketController,
  ],
  providers: [
    FavoriteProductRepository,
    FavoriteProductService,
    {
      provide: FavoriteStrategyToken.PRODUCT,
      useClass: FavoriteProductService,
    },
    FavoriteMarketRepository,
    FavoriteMarketService,
    {
      provide: FavoriteStrategyToken.MARKET,
      useClass: FavoriteMarketService,
    },
  ],
})
export class FavoriteModule {}