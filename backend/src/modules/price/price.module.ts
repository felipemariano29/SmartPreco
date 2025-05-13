import { FavoriteModule } from '@modules/favorite/favorite.module';
import { NotificationModule } from '@modules/notification/notification.module';
import { PriceComparatorService } from '@modules/price/price-comparator/price-comparator.service';
import { PriceController } from '@modules/price/price.controller';
import { PriceListener } from '@modules/price/price.listener';
import { PriceRepository } from '@modules/price/price.repository';
import { PriceService } from '@modules/price/price.service';
import { forwardRef, Module } from '@nestjs/common';
import { ClerkModule } from '@shared/clerk/clerk.module';

@Module({
  imports: [
    forwardRef(() => FavoriteModule),
    ClerkModule,
    NotificationModule
   ],
  controllers: [ PriceController ],
  providers: [ PriceService, PriceRepository, PriceListener, PriceComparatorService ],
  exports: [ PriceService, PriceRepository, PriceComparatorService ],
})
export class PriceModule {}
