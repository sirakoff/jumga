alter table "public"."dispatch" add constraint "dispatch_bank_code_account_number_key" unique ("bank_code", "account_number");
