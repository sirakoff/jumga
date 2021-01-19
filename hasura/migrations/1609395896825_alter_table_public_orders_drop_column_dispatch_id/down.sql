ALTER TABLE "public"."orders" ADD COLUMN "dispatch_id" int8;
ALTER TABLE "public"."orders" ALTER COLUMN "dispatch_id" DROP NOT NULL;
