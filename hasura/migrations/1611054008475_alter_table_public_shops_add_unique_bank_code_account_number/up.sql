alter table "public"."shops" add constraint "shops_bank_code_account_number_key" unique ("bank_code", "account_number");
