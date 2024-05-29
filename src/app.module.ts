import { RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';

import { ProductsModule } from './products/products.module';
import { DrizzleModule } from './drizzle/drizzle.module';

@Module({
  imports: [
    ProductsModule,
    DrizzleModule,
  ],
})
export class AppModule {}
