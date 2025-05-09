import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FavoriteProductRepository {
  private readonly table = 'favorite_products';

  public constructor(private readonly supabase: SupabaseClient) {}

  public async findProductIdsByUser(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('product_id')
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data.map((item) => item.product_id);
  }

  public async exists(userId: string, productId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('id')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new BadRequestException(error.message);
    }

    return !!data;
  }

  public async insert(userId: string, productId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .insert({ user_id: userId, product_id: productId });

    if (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async delete(userId: string, productId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .match({ user_id: userId, product_id: productId });

    if (error) {
      throw new BadRequestException(error.message);
    }
  }
}