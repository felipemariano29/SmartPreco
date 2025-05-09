export interface FavoriteStrategy<T> {

  getFavorites(): Promise<T[]>;

  favorite(id: string): Promise<void>;

  unfavorite(id: string): Promise<void>;

}

export enum FavoriteStrategyToken {
  PRODUCT = 'FAVORITE_PRODUCT_STRATEGY',
  MARKET = 'FAVORITE_MARKET_STRATEGY',
}