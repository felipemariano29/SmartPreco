import { Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

import { FavoriteBaseRepository } from '../favorite.base.repository';


@Injectable()
export class FavoriteProductRepository extends FavoriteBaseRepository {

  protected tableName = 'favorite_products';
  protected columnName = 'product_id';

  public constructor(supabase: SupabaseClient) {
    super(supabase);
  }

}