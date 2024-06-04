import { Controller, ParseIntPipe } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto, ValidateProductDto } from './dto';
import { ProductLightSerializer } from './serializers/product-ligth-serializer';
import { PaginationDto, ResposeAllSerializer } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { ProductEntity } from './entities/product.entity';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern({ cmd: 'create_product' })
  async create(
    @Payload() createProductDto: CreateProductDto,
  ): Promise<ProductEntity> {
    return this.productsService.create(createProductDto);
  }

  @MessagePattern({ cmd: 'list_products' })
  async findAll(
    @Payload() paginationDto: PaginationDto,
  ): Promise<ResposeAllSerializer<ProductLightSerializer>> {
    const { data, metadata } =
      await this.productsService.findAll(paginationDto);

    const response: ResposeAllSerializer<ProductLightSerializer> = {
      data: ProductLightSerializer.fromMany(data),
      metadata,
    };

    return response;
  }

  @MessagePattern({ cmd: 'get_one_product' })
  async findOne(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return await this.productsService.findOne(id);
  }

  @MessagePattern({ cmd: 'update_product' })
  async update(
    @Payload() updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    return await this.productsService.update(
      updateProductDto.id,
      updateProductDto,
    );
  }

  @MessagePattern({ cmd: 'delete_hard_product' })
  async remove(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return await this.productsService.remove(id);
  }

  @MessagePattern({ cmd: 'delete_soft_product' })
  async softRemove(
    @Payload('id', ParseIntPipe) id: number,
  ): Promise<ProductEntity> {
    return await this.productsService.softRemove(id);
  }

  @MessagePattern({ cmd: 'validate_products_existence' })
  async validateProductsExistence(
    @Payload() validateProducts: ValidateProductDto[],
  ): Promise<ProductEntity[]> {
    return await this.productsService.validateProductsExistence(
      validateProducts,
    );
  }

  @MessagePattern({ cmd: 'validate_products_existence_and_stock' })
  async validateProductsExistenceAndStock(
    @Payload() validateProducts: ValidateProductDto[],
  ): Promise<ProductEntity[]> {
    return await this.productsService.validateProductsExistenceAndStock(
      validateProducts,
    );
  }
}
