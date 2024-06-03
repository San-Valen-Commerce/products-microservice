import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  serial,
  varchar,
} from 'drizzle-orm/pg-core';

export enum CATEGORY_ENUM {
  ELECTRONICS = 'electronics',
  CLOTHING = 'clothing',
  FURNITURE = 'furniture',
  BOOKS = 'books',
}

export const categoryEnum = pgEnum('category', [
  CATEGORY_ENUM.ELECTRONICS,
  CATEGORY_ENUM.CLOTHING,
  CATEGORY_ENUM.FURNITURE,
  CATEGORY_ENUM.BOOKS,
]);

export const product = pgTable(
  'PRODUCT',
  {
    id: serial('id').primaryKey(),
    title: varchar('title', { length: 256 }).unique(),
    description: varchar('description', { length: 1024 }),
    price: integer('price').default(0),
    discountPercentage: integer('discount_percentage').default(0),
    rating: integer('rating').default(0),
    stock: integer('stock').default(0),
    brand: varchar('brand', { length: 256 }).default('Generic'),
    category: categoryEnum('category'),
    thumbnail: varchar('thumbnail_media_url', { length: 256 }).default(
      'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png',
    ),
    available: boolean('available').default(true),
  },
  (table) => {
    return {
      availableIdx: index('available_idx').on(table.available),
    };
  },
);

export type Product = typeof product.$inferSelect;
export type Category = Product['category'];
export const CATEGORY_LIST = product.category.enumValues;
