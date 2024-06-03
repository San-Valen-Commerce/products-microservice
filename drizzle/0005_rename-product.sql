ALTER TABLE "product" RENAME TO "PRODUCT";--> statement-breakpoint
ALTER TABLE "PRODUCT" DROP CONSTRAINT "product_title_unique";--> statement-breakpoint
ALTER TABLE "PRODUCT" ADD CONSTRAINT "PRODUCT_title_unique" UNIQUE("title");