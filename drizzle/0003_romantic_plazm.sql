ALTER TABLE "products" DROP COLUMN "type";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "coverage_points";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "premium_start";--> statement-breakpoint
ALTER TABLE "products" DROP COLUMN "premium_end";--> statement-breakpoint
DROP TYPE "public"."product_type";