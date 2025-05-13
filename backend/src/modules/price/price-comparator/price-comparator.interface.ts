export interface PriceComparatorPriceData {
  productId: string;
  productName: string;
  newPrice: number;
}

export interface PriceComparatorUser {
  userId: string;
  deviceId: string;
  email?: string;
}

export interface PriceComparatorNotification {
  shouldNotify: boolean;
  productName: string;
  newPrice: number;
  usersToNotify: PriceComparatorUser[];
}