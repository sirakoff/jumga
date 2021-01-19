CREATE TABLE "public"."orders"("id" bigserial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "user_id" bigint NOT NULL, "shop_id" bigint NOT NULL, "total" float8 NOT NULL, "country" text NOT NULL, "currency" text NOT NULL, "dispatch_id" bigint, PRIMARY KEY ("id") );
CREATE OR REPLACE FUNCTION "public"."set_current_timestamp_updated_at"()
RETURNS TRIGGER AS $$
DECLARE
  _new record;
BEGIN
  _new := NEW;
  _new."updated_at" = NOW();
  RETURN _new;
END;
$$ LANGUAGE plpgsql;
CREATE TRIGGER "set_public_orders_updated_at"
BEFORE UPDATE ON "public"."orders"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_orders_updated_at" ON "public"."orders" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
