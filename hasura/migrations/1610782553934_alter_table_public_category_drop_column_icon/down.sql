ALTER TABLE "public"."category" ADD COLUMN "icon" text;
ALTER TABLE "public"."category" ALTER COLUMN "icon" DROP NOT NULL;
