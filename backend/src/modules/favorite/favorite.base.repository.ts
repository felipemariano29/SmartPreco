import { BadRequestException } from '@nestjs/common';
import { SupabaseClient } from '@supabase/supabase-js';

export abstract class FavoriteBaseRepository {

  protected abstract tableName: string;
  protected abstract columnName: string;

  public constructor(protected readonly supabase: SupabaseClient) {}

  public async findIdsByUser(userId: string): Promise<string[]> {

    const { data, error } = await this.supabase
      .from(this.tableName)
      .select(this.columnName)
      .eq('user_id', userId);

    if (error) throw new BadRequestException(error.message);

    return data.map((item) => item[this.columnName]);
  }

  public async exists(userId: string, id: string): Promise<boolean> {
    const { data } = await this.supabase
      .from(this.tableName)
      .select()
      .eq('user_id', userId)
      .eq(this.columnName, id)
      .maybeSingle();

    return !!data;
  }

  public async insert(userId: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .insert({ user_id: userId, [this.columnName]: id });

    if (error) throw new BadRequestException(error.message);
  }

  public async delete(userId: string, id: string): Promise<void> {
    const { error } = await this.supabase
      .from(this.tableName)
      .delete()
      .eq('user_id', userId)
      .eq(this.columnName, id);

    if (error) throw new BadRequestException(error.message);
  }

}