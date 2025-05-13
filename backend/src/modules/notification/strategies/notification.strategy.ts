import { NotificationParams } from "@modules/notification/notification.interface";

export interface NotificationStrategy {

  send(params: NotificationParams): Promise<void>;

}