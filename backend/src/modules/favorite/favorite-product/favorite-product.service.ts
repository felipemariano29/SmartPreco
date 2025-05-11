import { Injectable } from '@nestjs/common';

import { ContextService } from '../../../shared/context/context.service';
import { ProductDto } from '../../product/product.dto';
import { ProductService } from '../../product/product.service';
import { FavoriteBaseService } from '../favorite.base.service';
import { FavoriteProductRepository } from './favorite-product.repository';

@Injectable()
export class FavoriteProductService extends FavoriteBaseService<ProductDto> {

  public constructor(
    contextService: ContextService,
    private readonly productService: ProductService,
    private readonly favoriteProductRepository: FavoriteProductRepository,
  ) {
    super(contextService);
  }

  protected findIdsByUser(userId: string): Promise<string[]> {
    return this.favoriteProductRepository.findIdsByUser(userId);
  }

  protected findManyByIds(ids: string[]): Promise<ProductDto[]> {
    return Promise.all(ids.map((id) => this.productService.readProductById(id)));
  }

  protected exists(userId: string, id: string): Promise<boolean> {
    return this.favoriteProductRepository.exists(userId, id);
  }

  protected insert(userId: string, id: string): Promise<void> {
    return this.favoriteProductRepository.insert(userId, id);
  }

  protected delete(userId: string, id: string): Promise<void> {
    return this.favoriteProductRepository.delete(userId, id);
  }

}