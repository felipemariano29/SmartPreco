import { NotificationParams } from "@modules/notification/notification.interface";
import { NotificationStrategy } from "@modules/notification/strategies/notification.strategy";
import { Injectable, Logger } from "@nestjs/common";
import { MainTag } from "main.enum";

@Injectable()
export class DiscordNotificationStrategy implements NotificationStrategy {

  private readonly logger = new Logger(MainTag.DISCORD_NOTIFICATION);
  private readonly webhookUrl = process.env.DISCORD_WEBHOOK_URL;

  public async send(params: NotificationParams): Promise<void> {
    const { title, body } = params;

    if (!this.webhookUrl) {
      this.logger.error('DISCORD_WEBHOOK_URL não configurado');
      return;
    }

    const payload = {
      content: `\n**${title}**\n${body}`,
      username: 'SmartPreçoBOT',
    };

    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      this.logger.verbose(`Notificação enviada ao Discord`);
    } catch (err) {
      this.logger.error(`Falha ao enviar Discord: ${err.message}`);
    }
  }

}