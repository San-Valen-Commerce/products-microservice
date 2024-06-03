import { count, eq, and } from 'drizzle-orm';
import { HttpStatus, Injectable } from '@nestjs/common';
import { CreateProductDto, UpdateProductDto } from './dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { PaginationDto, IMetadata } from 'src/common';
import { ProductEntity } from './entities/product.entity';
import { RpcException } from '@nestjs/microservices';

@Injectable()
export class ProductsService {
  constructor(private drizzle: DrizzleService) {}

  async create(createProductDto: CreateProductDto) {
    const result = await this.drizzle.db
      .insert(this.drizzle.schema.product)
      .values(createProductDto)
      .returning();

    if (result.length) {
      return result[0];
    }

    return result;
  }

  async findAll(paginationDto: PaginationDto) {
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

  async findOne(id: number) {
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

  async update(identifier: number, updateProductDto: UpdateProductDto) {
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

  async remove(id: number) {
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

  async softRemove(id: number) {
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

  async getTotalProducts() {
    return (
      await this.drizzle.db
        .select({ count: count() })
        .from(this.drizzle.schema.product)
        .where(eq(this.drizzle.schema.product.available, true))
    )[0].count;
  }
}
