import { BadRequestException, Injectable } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

@Injectable()
export class FavoriteMarketRepository {
  private readonly table = 'favorite_markets';

  public constructor(private readonly supabase: SupabaseClient) {}

  public async findMarketIdsByUser(userId: string): Promise<string[]> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('market_id')
      .eq('user_id', userId);

    if (error) {
      throw new BadRequestException(error.message);
    }

    return data.map((item) => item.market_id);
  }

  public async exists(userId: string, marketId: string): Promise<boolean> {
    const { data, error } = await this.supabase
      .from(this.table)
      .select('id')
      .eq('user_id', userId)
      .eq('market_id', marketId)
      .maybeSingle();

    if (error && error.code !== 'PGRST116') {
      throw new BadRequestException(error.message);
    }

    return !!data;
  }

  public async insert(userId: string, marketId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .insert({ user_id: userId, market_id: marketId });

    if (error) {
      throw new BadRequestException(error.message);
    }
  }

  public async delete(userId: string, marketId: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.table)
      .delete()
      .match({ user_id: userId, market_id: marketId });

    if (error) {
      throw new BadRequestException(error.message);
    }
  }
}