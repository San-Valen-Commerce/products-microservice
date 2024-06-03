import { Category, Product } from 'src/drizzle/schema';

export class ProductEntity implements Product {
  id!: number;
  title!: string;
  description!: string;
  brand!: string;
  price!: number;
  discountPercentage!: number;
  rating!: number;
  stock!: number;
  category!: Category;
  thumbnail!: string;
  available!: boolean;
}

export interface IProductEntity extends ProductEntity {}
