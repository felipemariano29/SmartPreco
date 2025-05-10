import { Injectable } from '@nestjs/common';

import { DtoMapper } from '../../shared/utils/dto-mapper';
import { ProductCreateDto, ProductDto, ProductReadDto, ProductsDto, ProductTimestampDto, ProductUpdateDto } from './product.dto';
import { ProductRepository } from './product.repository';

@Injectable()
export class ProductService {

  public constructor(private readonly productRepository: ProductRepository) {}

  public async createProduct(params: ProductCreateDto): Promise<ProductDto> {
    const product = await this.productRepository.createProduct(params);

    return DtoMapper.mapOne(product, this.toDto);
  }

  public async readProducts(params: ProductReadDto): Promise<ProductsDto> {
    const products = await this.productRepository.readProducts(params);

    return { products: DtoMapper.mapMany(products, this.toDto) };
  }

  public async readProductById(productId: string): Promise<ProductDto> {
    const product = await this.productRepository.readProductById(productId);

    return DtoMapper.mapOne(product, this.toDto);
  }

  public async updateProductById(
    productId: string,
    updateProductDto: ProductUpdateDto,
  ): Promise<ProductDto> {
    const product = await this.productRepository.updateProductById(productId, updateProductDto);

    return DtoMapper.mapOne(product, this.toDto);
  }

  public async deleteProductById(productId: string): Promise<void> {
    await this.productRepository.deleteProductById(productId);
  }

  private toDto(product: ProductTimestampDto): ProductDto {
    const { id, name, description, category } = product;
    return { id, name, description, category };
  }

}
