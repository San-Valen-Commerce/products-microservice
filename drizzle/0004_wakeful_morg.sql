ALTER TABLE "product" ALTER COLUMN "price" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "discount_percentage" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "rating" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "stock" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "brand" SET DEFAULT 'Generic';--> statement-breakpoint
ALTER TABLE "product" ALTER COLUMN "thumbnail_media_url" SET DEFAULT 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png';