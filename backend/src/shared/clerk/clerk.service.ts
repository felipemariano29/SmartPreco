import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable, Logger } from '@nestjs/common';
import { MainTag } from 'main.enum';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(MainTag.CLERK);

  public constructor() {}

  /**
   * Get the deviceId stored in the privateMetadata of a user.
   * @param userId - Clerk userId
   */
  public async getDeviceIdByUserId(userId: string): Promise<string | null> {
    try {
      const user = await clerkClient.users.getUser(userId);

      const deviceId = user.privateMetadata?.pushToken as string | undefined;

      if (!deviceId) {
        this.logger.warn(`No deviceId found for userId: ${userId}`);
        return null;
      }

      return deviceId;
    } catch (error) {
      this.logger.error(`Failed to fetch Clerk user for userId: ${userId}`, error.stack);
      return null;
    }
  }
}