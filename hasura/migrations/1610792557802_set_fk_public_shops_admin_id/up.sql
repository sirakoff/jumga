alter table "public"."shops"
           add constraint "shops_admin_id_fkey"
           foreign key ("admin_id")
           references "public"."users"
           ("id") on update no action on delete no action;
