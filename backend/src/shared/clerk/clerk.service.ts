import { clerkClient } from '@clerk/clerk-sdk-node';
import { Injectable, Logger } from '@nestjs/common';
import { UserData } from '@shared/user/user.interface';
import { MainTag } from 'main.enum';

@Injectable()
export class ClerkService {
  private readonly logger = new Logger(MainTag.CLERK);

  public constructor() {}

  /**
   * Get the deviceId stored in the privateMetadata of a user.
   * @param userId - Clerk userId
   */
  public async getUserData(userId: string): Promise<UserData> {
    try {
      const user = await clerkClient.users.getUser(userId);

      const deviceId = user.privateMetadata?.pushToken as string | undefined;
      const email = user.emailAddresses[0].emailAddress;

      if (!deviceId) {
        this.logger.warn(`No deviceId found for userId: ${userId}`);
        return null;
      }

      return { userId, deviceId, email };
    } catch (error) {
      this.logger.error(`Failed to fetch Clerk user for userId: ${userId}`, error.stack);
      return null;
    }
  }
}