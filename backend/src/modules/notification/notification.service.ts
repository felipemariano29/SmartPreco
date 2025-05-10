import { NotificationParams } from '@modules/notification/notification.interface';
import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';


@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly expo = new Expo();

  public async sendNotifications(params: NotificationParams): Promise<void> {
    try {
      const { usersToNotify, title, body, data } = params;

      usersToNotify.push({ deviceId: "ExponentPushToken[DIQtPFCyRy_zD-pdwfRADe]" });

      const messages: ExpoPushMessage[] = usersToNotify
        .filter(({ deviceId }) => Expo.isExpoPushToken(deviceId))
        .map(({ deviceId }) => ({
          to: deviceId,
          sound: 'default',
          title,
          body,
          data,
          priority: 'high',
          ttl: 86400, // 24h
          expiration: Math.floor(Date.now() / 1000) + 86400,
          badge: 1,
          subtitle: 'Check this out!',
          channelId: 'default',
          mutableContent: true,
        }));

      if (messages.length === 0) {
        this.logger.warn('No valid Expo push tokens to send notifications.');
        return;
      }

      const ticketChunk = await this.expo.sendPushNotificationsAsync(messages);

      this.logger.verbose(`Push notifications sent with ticket chunk: ${JSON.stringify(ticketChunk)}`);
    } catch (error) {
      this.logger.error(`Failed to send push notifications via Expo SDK: ${error.message}`, error.stack);
    }
  }
}