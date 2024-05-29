import { count, eq, and } from 'drizzle-orm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { DrizzleService } from 'src/drizzle/drizzle.service';
import { PaginationDto, IMetadata } from 'src/common';
import { ProductEntity } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(private drizzle: DrizzleService) {}

  async create(createProductDto: CreateProductDto) {
    return this.drizzle.db
      .insert(this.drizzle.schema.product)
      .values(createProductDto)
      .returning();
  }

  async findAll(paginationDto: PaginationDto) {

    const totalProducts = await this.getTotalProducts();
    const { limit, page } = paginationDto;
    const lastPage = Math.ceil(totalProducts / limit);
    
    const metadata: IMetadata = {
      total: totalProducts,
      page,
      lastPage
    }

    const data: ProductEntity[] = 
      await this.drizzle.db
        .select()
        .from(this.drizzle.schema.product)
        .where(
          eq(this.drizzle.schema.product.available, true)
        )
        .limit(limit)
        .offset((page - 1) * limit)


    return {
      data,
      metadata
    };
  }

  findOne(id: number) {
    return this.drizzle.db
      .select()
      .from(this.drizzle.schema.product)
      .where(
        and(
          eq(this.drizzle.schema.product.id, id),
          eq(this.drizzle.schema.product.available, true)
        )
      );
  }

  async update(id: number, updateProductDto: UpdateProductDto) {

    const result = await this.drizzle.db
      .update(this.drizzle.schema.product)
      .set(updateProductDto)
      .where(
        eq(this.drizzle.schema.product.id, id)
      )
      .returning()

    if (result.length === 0) {
      throw new NotFoundException();
    }

    return result;
  }

  async remove(id: number) {

    const result = await this.drizzle.db
      .delete(this.drizzle.schema.product)
      .where(
        eq(this.drizzle.schema.product.id, id)
      )
      .returning()

    if (result.length === 0) {
      throw new NotFoundException();
    }

    return result;
  }

  async softRemove(id: number) {
      
    const result = await this.drizzle.db
      .update(this.drizzle.schema.product)
      .set({ available: false })
      .where(
        eq(this.drizzle.schema.product.id, id)
      )
      .returning()

    if (result.length === 0) {
      throw new NotFoundException();
    }

    return result;
  }

  async getTotalProducts() {
    return (
      await this.drizzle.db
        .select({ count: count() })
        .from(this.drizzle.schema.product)
        .where(
          eq(this.drizzle.schema.product.available, true)
        )
    )[0].count;
  }
}
