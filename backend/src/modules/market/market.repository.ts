import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { MarketCreateDto, MarketReadDto, MarketsTimestampDto, MarketTimestampDto, MarketUpdateDto } from "./market.dto";

@Injectable()
export class MarketRepository {

  public constructor(private readonly supabase: SupabaseClient) {}

  public async createMarket(params: MarketCreateDto): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from('markets')
      .insert(params)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  public async readMarkets(params: MarketReadDto): Promise<MarketsTimestampDto> {
    const { search, limit = 20, offset = 0, orderBy } = params;

    let query = this.supabase
      .from('markets')
      .select('*', { count: 'exact' });

    if (search) {
      query = query.or(`name.ilike.%${search}%,address.ilike.%${search}%`);
    }

    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count: total } = await query;

    if (error) {
      throw new BadRequestException(error.message);
    }

    return {
      records: data,
      total: total ?? 0,
    };
  }

  public async readMarketById(marketId: string): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from('markets')
      .select('*')
      .eq('id', marketId)
      .single();

    if (error) throw new NotFoundException(`Market with ID ${marketId} not found`);

    return data;
  }

  public async updateMarketById(marketId: string, dto: MarketUpdateDto): Promise<MarketTimestampDto> {
    const { data, error } = await this.supabase
      .from('markets')
      .update(dto)
      .eq('id', marketId)
      .select()
      .single();

    if (error) throw new BadRequestException(error.message);

    return data;
  }

  public async deleteMarketById(marketId: string): Promise<void> {
    const { error } = await this.supabase
      .from('markets')
      .delete()
      .eq('id', marketId);

    if (error) throw new BadRequestException(error.message);
  }
}