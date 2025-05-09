import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { FavoriteBaseRepository } from '../favorite.base.repository';

@Injectable()
export class FavoriteMarketRepository extends FavoriteBaseRepository {

  protected tableName = 'favorite_markets';
  protected columnName = 'market_id';

  public constructor(supabase: SupabaseClient) {
    super(supabase);
  }

}