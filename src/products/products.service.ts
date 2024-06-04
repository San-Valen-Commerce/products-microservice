import { count, eq, and, inArray } from 'drizzle-orm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto, ValidateProductDto } from './dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { PaginationDto, IMetadata, ResposeAllSerializer } from 'src/common';
import { RpcException } from '@nestjs/microservices';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private drizzle: DrizzleService) {}

  async create(createProductDto: CreateProductDto): Promise<ProductEntity> {
    return (
      await this.drizzle.db
        .insert(this.drizzle.schema.product)
        .values(createProductDto)
        .returning()
    )[0];
  }

  async findAll(
    paginationDto: PaginationDto,
  ): Promise<ResposeAllSerializer<ProductEntity>> {
    const totalProducts = await this.getTotalProducts();
    const { limit, page } = paginationDto;
    const lastPage = Math.ceil(totalProducts / limit);

    const metadata: IMetadata = {
      total: totalProducts,
      page,
      lastPage,
    };

    const data: ProductEntity[] = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.product)
      .where(eq(this.drizzle.schema.product.available, true))
      .limit(limit)
      .offset((page - 1) * limit);

    return {
      data,
      metadata,
    };
  }

  async findOne(id: number): Promise<ProductEntity> {
    const result = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.product)
      .where(
        and(
          eq(this.drizzle.schema.product.id, id),
          eq(this.drizzle.schema.product.available, true),
        ),
      );

    if (result.length === 0) {
      throw new RpcException({
        message: `Product #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return result[0];
  }

  async update(
    identifier: number,
    updateProductDto: UpdateProductDto,
  ): Promise<ProductEntity> {
    const { id, ...updateProductDtoWithoutId } = updateProductDto;

    const result = await this.drizzle.db
      .update(this.drizzle.schema.product)
      .set(updateProductDtoWithoutId)
      .where(eq(this.drizzle.schema.product.id, identifier))
      .returning();

    if (result.length === 0) {
      throw new RpcException({
        message: `Product #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return result[0];
  }

  async remove(id: number): Promise<ProductEntity> {
    const result = await this.drizzle.db
      .delete(this.drizzle.schema.product)
      .where(eq(this.drizzle.schema.product.id, id))
      .returning();

    if (result.length === 0) {
      throw new RpcException({
        message: `Product #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return result[0];
  }

  async softRemove(id: number): Promise<ProductEntity> {
    const result = await this.drizzle.db
      .update(this.drizzle.schema.product)
      .set({ available: false })
      .where(eq(this.drizzle.schema.product.id, id))
      .returning();

    if (result.length === 0) {
      throw new RpcException({
        message: `Product #${id} not found`,
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return result[0];
  }

  async validateProductsExistenceAndStock(
    validateProducts: ValidateProductDto[],
  ): Promise<ProductEntity[]> {
    const idsWithoutDuplicates = Array.from(
      new Set(validateProducts.map((p) => p.id)),
    );

    const validateProductsMapping = new Map(
      validateProducts.map((p) => [p.id, p]),
    );

    const products = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.product)
      .where(
        and(
          eq(this.drizzle.schema.product.available, true),
          inArray(this.drizzle.schema.product.id, idsWithoutDuplicates),
        ),
      );

    if (products.length !== idsWithoutDuplicates.length) {
      throw new RpcException({
        message: 'Some products do not exist or are not available',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    for (const product of products) {
      if (product.stock === 0) {
        throw new RpcException({
          message: `Product #${product.id} is out of stock`,
          status: HttpStatus.BAD_REQUEST,
        });
      }

      const validateProduct = validateProductsMapping.get(product.id);

      if (validateProduct) {
        if (product.stock < validateProduct.quantity) {
          throw new RpcException({
            message: `Product #${product.id} does not have enough stock`,
            status: HttpStatus.BAD_REQUEST,
          });
        }
      }
    }

    return products;
  }

  async validateProductsExistence(
    validateProducts: ValidateProductDto[],
  ): Promise<ProductEntity[]> {
    const idsWithoutDuplicates = Array.from(
      new Set(validateProducts.map((p) => p.id)),
    );

    const products = await this.drizzle.db
      .select()
      .from(this.drizzle.schema.product)
      .where(
        and(
          eq(this.drizzle.schema.product.available, true),
          inArray(this.drizzle.schema.product.id, idsWithoutDuplicates),
        ),
      );

    if (products.length !== idsWithoutDuplicates.length) {
      throw new RpcException({
        message: 'Some products do not exist or are not available',
        status: HttpStatus.BAD_REQUEST,
      });
    }

    return products;
  }

  async getTotalProducts(): Promise<number> {
    return (
      await this.drizzle.db
        .select({ count: count() })
        .from(this.drizzle.schema.product)
        .where(eq(this.drizzle.schema.product.available, true))
    )[0].count;
  }
}
