import { BadRequestException, Injectable } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { MarketDto } from "../market/market.dto";
import { ProductDto } from "../product/product.dto";
import { PriceCreateRepositoryDto, PriceReadDto, PricesTimestampDto, PriceTimestampDto, PriceUpdateDto } from "./price.dto";

@Injectable()
export class PriceRepository {
  private readonly selectFields = `
    id,
    price,
    user_id,
    image_url,
    moderated,
    created_at,
    updated_at,
    market:markets(*),
    product:products(*)
  `;

  public constructor(private readonly supabase: SupabaseClient) {}

  public async createPrice(params: PriceCreateRepositoryDto): Promise<PriceTimestampDto> {
    const { data, error } = await this.supabase
      .from('prices')
      .insert(params)
      .select(this.selectFields)
      .single();

    if (error) throw new BadRequestException(error.message);

    return {
      ...data,
      market: data.market as unknown as MarketDto,
      product: data.product as unknown as ProductDto,
      imageUrl: data.image_url,
      userId: data.user_id,
      moderated: data.moderated,
      createdAt: data.created_at,
      updatedAt: data.updated_at,
    };
  }

   public async readPrices(params: PriceReadDto): Promise<PricesTimestampDto> {
    const { search, limit = 20, offset = 0, orderBy, productId, marketId } = params;

    let query = this.supabase
      .from('prices')
      .select(`
        *,
        market:market_id (id, name, address, city, state),
        product:product_id (id, name, category, description)
      `, { count: 'exact' })
      .eq('moderated', true);

    if (marketId) query = query.eq('market_id', marketId);
    if (productId) query = query.eq('product_id', productId);

    if (search) {
      query = query.or(`product.name.ilike.%${search}%,market.name.ilike.%${search}%`);
    }

    if (orderBy) {
      query = query.order(orderBy, { ascending: true });
    }

    query = query.range(offset, offset + limit - 1);

    const { data, error, count: total } = await query;

    if (error) throw new BadRequestException(error.message);

    return {
      records: data,
      total: total ?? 0,
    };
  }

  public async updatePriceById(priceId: string, params: PriceUpdateDto): Promise<void> {
    const { error } = await this.supabase
      .from('prices')
      .update(params)
      .eq('id', priceId);

    if (error) {
      throw new BadRequestException(error.message);
    }
  }

}