import {
  Controller,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductLightSerializer } from './serializers/product-ligth-serializer';
import { PaginationDto, ResposeAllSerializer } from 'src/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  // @Post()
  @MessagePattern({ cmd: 'create_product' })
  async create(@Payload() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  // @Get()
  @MessagePattern({ cmd: 'list_products' })
  async findAll(@Payload() paginationDto: PaginationDto): Promise<ResposeAllSerializer<ProductLightSerializer>> {
    const { data, metadata } = await this.productsService.findAll(paginationDto);

    const response: ResposeAllSerializer<ProductLightSerializer> = {
      data: ProductLightSerializer.fromMany(data),
      metadata
    }

    return response;
  }

  // @Get(':id')
  @MessagePattern({ cmd: 'get_one_product' })
  findOne(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.findOne(id);
  }

  // @Patch(':id')
  @MessagePattern({ cmd: 'update_product' })
  update(@Payload() updateProductDto: UpdateProductDto) {
    return this.productsService.update(updateProductDto.id, updateProductDto);
  }

  // @Delete(':id')
  @MessagePattern({ cmd: 'delete_hard_product' })
  remove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  // @Delete(':id/soft')
  @MessagePattern({ cmd: 'delete_soft_product' })
  softRemove(@Payload('id', ParseIntPipe) id: number) {
    return this.productsService.softRemove(id);
  }
}
