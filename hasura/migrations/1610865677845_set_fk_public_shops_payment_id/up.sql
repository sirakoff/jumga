alter table "public"."shops"
           add constraint "shops_payment_id_fkey"
           foreign key ("payment_id")
           references "public"."payments"
           ("id") on update no action on delete no action;
