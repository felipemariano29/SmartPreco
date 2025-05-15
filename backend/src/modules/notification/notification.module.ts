import { NOTIFICATION_STRATEGIES } from "@modules/notification/notification.const";
import { NotificationStrategy } from "@modules/notification/strategies/notification.strategy";
import { DynamicModule, Module, Provider, Type } from "@nestjs/common";

@Module({})
export class NotificationModule {
  public static register(strategies: Type<NotificationStrategy>[]): DynamicModule {
    const strategyProvider: Provider = {
      provide: NOTIFICATION_STRATEGIES,
      useFactory: (...instances: NotificationStrategy[]) => instances,
      inject: strategies,
    };

    return {
      module: NotificationModule,
      providers: [
        ...strategies,
        strategyProvider,
      ],
      exports: [
        strategyProvider,
      ],
    };
  }
}