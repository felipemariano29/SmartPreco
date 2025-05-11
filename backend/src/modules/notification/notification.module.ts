import { NotificationService } from "@modules/notification/notification.service";
import { Module } from "@nestjs/common";


@Module({
  providers: [ NotificationService ],
  exports: [ NotificationService ],
})
export class NotificationModule {}