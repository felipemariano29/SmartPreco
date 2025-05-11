import { FavoriteBaseRepository } from '@modules/favorite/favorite.base.repository';
import { Injectable } from '@nestjs/common';
import { EntityEnum } from '@shared/errors';
import { SupabaseClient } from '@supabase/supabase-js';


@Injectable()
export class FavoriteProductRepository extends FavoriteBaseRepository {

  protected tableName = EntityEnum.FAVORITE_PRODUCTS;
  protected columnName = 'product_id';

  public constructor(supabase: SupabaseClient) {
    super(supabase);
  }

  public async findFavoritesByProductId(productId: string): Promise<any[]> {
    const { data, error } = await this.supabase
      .from('favorite_products')
      .select('user_id')
      .eq('product_id', productId);

    if (error) {
      throw new Error(`Failed to find favorites for product ${productId}: ${error.message}`);
    }

    return data;
  }

}