import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  Query
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductLightSerializer } from './serializers/product-ligth-serializer';
import { ApiBody, ApiQuery, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { PaginationDto, ResposeAllSerializer } from 'src/common';

@Controller({
  path: 'products',
  version: '1',
})
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  @ApiTags('products')
  @ApiOperation({ summary: 'Create new product' })
  @ApiResponse({ 
    status: 201, 
    description: 'The record has been successfully created.'
  })
  @ApiBody({
    type: CreateProductDto,
    description: 'JSON structrure to create a new product'
  })
  async create(@Body() createProductDto: CreateProductDto) {
    return this.productsService.create(createProductDto);
  }

  @Get()
  @ApiTags('products')
  @ApiOperation({ summary: 'List all available products' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
    example: 1
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
    example: 10
  })
  async findAll(
    @Query() paginationDto: PaginationDto
  ): Promise<ResposeAllSerializer<ProductLightSerializer>> {
    const { data, metadata } = await this.productsService.findAll(paginationDto);

    const response: ResposeAllSerializer<ProductLightSerializer> = {
      data: ProductLightSerializer.fromMany(data),
      metadata
    }

    return response;
  }

  @Get(':id')
  @ApiTags('products')
  @ApiOperation({ summary: 'Get a product by its id if its available' })
  findOne(@Param('id', ParseIntPipe)id: number) {
    return this.productsService.findOne(id);
  }

  @Patch(':id')
  @ApiTags('products')
  @ApiOperation({ summary: 'Update a product by its id' })
  @ApiBody({
    type: UpdateProductDto,
    description: 'JSON structrure to update an existing product'
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateProductDto: UpdateProductDto) {
    return this.productsService.update(id, updateProductDto);
  }

  @Delete(':id')
  @ApiTags('products')
  @ApiOperation({ summary: 'Hard deletes a product fromt the database' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.remove(id);
  }

  @Delete(':id/soft')
  @ApiTags('products')
  @ApiOperation({ summary: 'Soft deletes a product, only set available = false' })
  softRemove(@Param('id', ParseIntPipe) id: number) {
    return this.productsService.softRemove(id);
  }
}
