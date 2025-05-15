import { NotificationParams } from '@modules/notification/notification.interface';
import { NotificationStrategy } from '@modules/notification/strategies/notification.strategy';
import { Injectable, Logger } from '@nestjs/common';
import { Expo, ExpoPushMessage } from 'expo-server-sdk';
import { MainTag } from 'main.enum';

@Injectable()
export class ExpoPushNotificationStrategy implements NotificationStrategy {

  private readonly logger = new Logger(MainTag.EXPO_PUSH_NOTIFICATION);
  private readonly expo = new Expo();

  public async send(params: NotificationParams): Promise<void> {
    const { usersToNotify, title, body, data } = params;

    const messages: ExpoPushMessage[] = usersToNotify
      .filter(({ deviceId }) => Expo.isExpoPushToken(deviceId))
      .map(({ deviceId }) => ({
        to: deviceId,
        sound: 'default',
        title,
        body,
        data,
        priority: 'high',
        ttl: 86400,
        expiration: Math.floor(Date.now() / 1000) + 86400,
        badge: 1,
        subtitle: 'Check this out!',
        channelId: 'default',
        mutableContent: true,
      }));

    if (messages.length === 0) {
      this.logger.warn('Nenhum token Expo válido encontrado.');
      return;
    }

    try {
      const ticketChunk = await this.expo.sendPushNotificationsAsync(messages);
      this.logger.verbose(`Tickets enviados: ${JSON.stringify(ticketChunk)}`);
    } catch (error) {
      this.logger.error(`Falha no envio via Expo: ${error.message}`, error.stack);
    }
  }

}