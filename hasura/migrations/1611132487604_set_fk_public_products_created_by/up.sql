alter table "public"."products"
           add constraint "products_created_by_fkey"
           foreign key ("created_by")
           references "public"."users"
           ("id") on update no action on delete no action;
