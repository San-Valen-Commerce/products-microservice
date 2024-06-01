import { IProduct } from '../entities/product.entity';
import {
  IsString,
  IsNotEmpty,
  IsInt,
  IsIn,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { CATEGORY_LIST, Category } from 'src/drizzle/schema';

interface ICreateProduct extends Omit<IProduct, 'id' | 'available'> {}

export class CreateProductDto implements ICreateProduct {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsNotEmpty()
  @IsInt()
  @Min(0)
  @IsOptional()
  price!: number;

  @IsNotEmpty()
  @IsOptional()
  @IsInt()
  @Min(0)
  discountPercentage!: number;

  @IsNotEmpty()
  @IsOptional()
  @Min(0)
  @Max(500)
  @Transform(({ value }) => Number((value * 100).toFixed(0)))
  rating!: number;

  @IsNotEmpty()
  @IsInt()
  @IsOptional()
  stock!: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  brand!: string;

  @IsNotEmpty()
  @IsIn(CATEGORY_LIST)
  category!: Category;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  thumbnail!: string;
}
