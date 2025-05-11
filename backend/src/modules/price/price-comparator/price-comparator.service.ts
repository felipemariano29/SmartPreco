/* eslint-disable max-len */
import { FavoriteProductService } from '@modules/favorite/favorite-product/favorite-product.service';
import { CHEAPER_THRESHOLD } from '@modules/price/price-comparator/price-comparator.const';
import { PriceComparatorNotification, PriceComparatorPriceData, PriceComparatorUser } from '@modules/price/price-comparator/price-comparator.interface';
import { PriceService } from '@modules/price/price.service';
import { Injectable, Logger } from '@nestjs/common';
import { ClerkService } from '@shared/clerk/clerk.service';
import { MainTag } from 'main.enum';

@Injectable()
export class PriceComparatorService {

  private readonly logger = new Logger(MainTag.PRICE_COMPARATOR);

  public constructor(
    private readonly priceService: PriceService,
    private readonly favoriteService: FavoriteProductService,
    private readonly clerkService: ClerkService,
  ) { }

  public async analyzeNewPrice(priceId: string): Promise<PriceComparatorNotification> {
    const priceData = await this.getPriceData(priceId);

    const baseNotification = this.buildBaseNotification(priceData);

    const { productId, newPrice } = priceData;

    const usersToNotify = await this.getUsersToNotify(productId);

    if (usersToNotify.length === 0) {
      return this.skipNotification(`No users favorited product ${baseNotification.productName}.`, baseNotification);
    }

    const averagePrice = await this.priceService.calculateAverageModeratedPriceByProductId(productId);

    if (averagePrice === 0) {
      return this.skipNotification(`No moderated prices for product ${baseNotification.productName}.`, baseNotification);
    }

    const isCheaperEnough = this.isCheaperEnough(newPrice, averagePrice);

    if (!isCheaperEnough) {
      return this.skipNotification(`New price ${newPrice} is not cheaper enough than average price ${averagePrice}.`, baseNotification);
    }

    baseNotification.shouldNotify = true;
    baseNotification.usersToNotify = usersToNotify;

    this.logger.verbose(`Prepared notifications for product ${baseNotification.productName} for ${baseNotification.usersToNotify.length} users.`);

    return baseNotification;
  }

  private buildBaseNotification(params: PriceComparatorPriceData): PriceComparatorNotification {
    const { productName, newPrice } = params;

    return {
      shouldNotify: false,
      productName,
      newPrice,
      usersToNotify: [],
    };
  }

  private skipNotification(reason: string, baseNotification: PriceComparatorNotification): PriceComparatorNotification {
    this.logger.verbose(reason + ' Skipping notification.');

    return baseNotification;
  }

  private async getPriceData(priceId: string): Promise<PriceComparatorPriceData> {
    const price = await this.priceService.readPriceById(priceId);

    return {
      productId: price.product.id,
      productName: price.product.name,
      newPrice: price.price,
    };
  }

  private async getUsersToNotify(productId: string): Promise<PriceComparatorUser[]> {
    const userIds = await this.favoriteService.findUserIdsByProductId(productId);

    const usersPromises = userIds.map(async (userId) => {
        const deviceId = await this.clerkService.getDeviceIdByUserId(userId);

        return deviceId ? { userId, deviceId } : null;
    });

    return Promise.all(usersPromises);
  }

  private isCheaperEnough(newPrice: number, averagePrice: number): boolean {
    return newPrice < averagePrice * CHEAPER_THRESHOLD;
  }
}
