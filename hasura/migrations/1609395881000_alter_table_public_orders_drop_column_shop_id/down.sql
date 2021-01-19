ALTER TABLE "public"."orders" ADD COLUMN "shop_id" int8;
ALTER TABLE "public"."orders" ALTER COLUMN "shop_id" DROP NOT NULL;
