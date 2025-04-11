import { DynamicModule, Module } from "@nestjs/common";
import { createClient, SupabaseClient } from "@supabase/supabase-js";

@Module({})
export class SupabaseModule {
  public static forRoot(): DynamicModule {
    const supabaseProvider = {
      provide: SupabaseClient,
      useFactory: () => {
        return createClient(
          process.env.SUPABASE_URL,
          process.env.SUPABASE_KEY,
        );
      }
    };

    return {
      module: SupabaseModule,
      providers: [ supabaseProvider ],
      exports: [ supabaseProvider ],
      global: true,
    };
  }
}