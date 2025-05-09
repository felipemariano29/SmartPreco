import { Injectable } from '@nestjs/common';

import { ContextEnum } from '../../../shared/context/context.enum';
import { ContextService } from '../../../shared/context/context.service';
import { ProductDto } from '../../product/product.dto';
import { ProductService } from '../../product/product.service';
import { FavoriteStrategy } from '../favorite.strategy';
import { FavoriteProductRepository } from './favorite-product.repository';

@Injectable()
export class FavoriteProductService implements FavoriteStrategy<ProductDto> {
  public constructor(
    private readonly contextService: ContextService,
    private readonly productService: ProductService,
    private readonly favoriteProductRepository: FavoriteProductRepository,
  ) {}

  public async getFavorites(): Promise<ProductDto[]> {
    const userId = this.getUserId();

    const favoriteProductIds = await this.favoriteProductRepository.findProductIdsByUser(userId);

    const products = await Promise.all(
      favoriteProductIds.map((productId) =>
        this.productService.readProductById(productId),
      ),
    );

    return products;
  }

  public async favorite(productId: string): Promise<void> {
    const userId = this.getUserId();

    await this.productService.readProductById(productId); // valida existência

    const alreadyFavorited = await this.favoriteProductRepository.exists(userId, productId);
    if (!alreadyFavorited) {
      await this.favoriteProductRepository.insert(userId, productId);
    }
  }

  public async unfavorite(productId: string): Promise<void> {
    const userId = this.getUserId();

    await this.favoriteProductRepository.delete(userId, productId);
  }

  private getUserId(): string {
    const user = this.contextService.get(ContextEnum.USER);
    return user.id;
  }
}