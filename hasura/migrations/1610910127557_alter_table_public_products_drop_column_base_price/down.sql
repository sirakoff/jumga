ALTER TABLE "public"."products" ADD COLUMN "base_price" text;
ALTER TABLE "public"."products" ALTER COLUMN "base_price" DROP NOT NULL;
