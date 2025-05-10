import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { SupabaseClient } from "@supabase/supabase-js";

import { ProductCreateDto, ProductReadDto, ProductsTimestampDto, ProductTimestampDto, ProductUpdateDto } from "./product.dto";

@Injectable()
export class ProductRepository {

  public constructor(private readonly supabase: SupabaseClient) {}

    public async createProduct(params: ProductCreateDto): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
      .from('products')
      .insert(params)
      .select()
      .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data;
    }

    public async readProducts(params: ProductReadDto): Promise<ProductsTimestampDto> {
      const { search, limit = 20, offset = 0, orderBy } = params;

      let query = this.supabase
        .from('products')
        .select('*', { count: 'exact' });

      if (search) {
        query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
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


    public async readProductById(productId: string): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (error) {
        throw new NotFoundException(`Product with ID ${productId} not found`);
      }

      return data;
    }

    public async updateProductById(
      productId: string,
      updateProductDto: ProductUpdateDto,
    ): Promise<ProductTimestampDto> {
      const { data, error } = await this.supabase
        .from('products')
        .update(updateProductDto)
        .eq('id', productId)
        .select()
        .single();

      if (error) {
        throw new BadRequestException(error.message);
      }

      return data;
    }

    public async deleteProductById(productId: string): Promise<void> {
      const { error } = await this.supabase
        .from('products')
        .delete()
        .eq('id', productId);

      if (error) {
        throw new BadRequestException(error.message);
      }
    }

}