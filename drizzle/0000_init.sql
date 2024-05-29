DO $$ BEGIN
 CREATE TYPE "public"."category" AS ENUM('electronics', 'clothing', 'furniture', 'books');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "product" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" varchar(256),
	"description" varchar(1024),
	"price" integer,
	"discount_percentage" integer,
	"rating" integer,
	"stock" integer,
	"brand" varchar(256),
	"category" "category",
	"thumbnail_media_url" varchar(256)
);
