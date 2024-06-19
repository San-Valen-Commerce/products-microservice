DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('electronics', 'clothing', 'furniture', 'books');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "PRODUCT" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256) NOT NULL,
	"description" varchar(1024) NOT NULL,
	"price" integer DEFAULT 0 NOT NULL,
	"discount_percentage" integer DEFAULT 0 NOT NULL,
	"rating" integer DEFAULT 0 NOT NULL,
	"stock" integer DEFAULT 0 NOT NULL,
	"brand" varchar(256) DEFAULT 'Generic' NOT NULL,
	"category" "category" NOT NULL,
	"thumbnail_media_url" varchar(256) DEFAULT 'https://cdn.dummyjson.com/products/images/beauty/Essence%20Mascara%20Lash%20Princess/thumbnail.png' NOT NULL,
	"available" boolean DEFAULT true NOT NULL,
	CONSTRAINT "PRODUCT_title_unique" UNIQUE("title")
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "available_idx" ON "PRODUCT" ("available");