alter table "public"."products"
           add constraint "products_category_id_fkey"
           foreign key ("category_id")
           references "public"."category"
           ("id") on update no action on delete no action;
