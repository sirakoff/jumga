alter table "public"."products"
           add constraint "products_shop_id_fkey"
           foreign key ("shop_id")
           references "public"."shops"
           ("id") on update no action on delete no action;
