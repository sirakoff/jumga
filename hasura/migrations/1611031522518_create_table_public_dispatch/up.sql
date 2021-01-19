CREATE TABLE "public"."dispatch"("id" bigserial NOT NULL, "created_at" timestamptz NOT NULL DEFAULT now(), "updated_at" timestamptz NOT NULL DEFAULT now(), "account_id" text NOT NULL, "subaccount_id" text NOT NULL, "name" text NOT NULL, "country" text NOT NULL, "bank_code" text NOT NULL, "account_number" text NOT NULL, "rate_gh" float8 NOT NULL, "rate_uk" float8 NOT NULL, "rate_ng" float8 NOT NULL, "rate_ke" float8 NOT NULL, PRIMARY KEY ("id") );
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
CREATE TRIGGER "set_public_dispatch_updated_at"
BEFORE UPDATE ON "public"."dispatch"
FOR EACH ROW
EXECUTE PROCEDURE "public"."set_current_timestamp_updated_at"();
COMMENT ON TRIGGER "set_public_dispatch_updated_at" ON "public"."dispatch" 
IS 'trigger to set value of column "updated_at" to current timestamp on row update';
