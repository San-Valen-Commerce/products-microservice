import { Product } from 'src/drizzle/schema'

export class ProductEntity implements Product {
  id!: number;
  title!: string | null;
  description!: string | null;
  brand!: string | null;
  price!: number | null;
  discountPercentage!: number | null;
  rating!: number | null;
  stock!: number | null;
  category!: 'electronics' | 'clothing' | 'furniture' | 'books' | null;
  thumbnail!: string | null;
  available!: boolean | null;
}

export interface IProduct extends ProductEntity {}
