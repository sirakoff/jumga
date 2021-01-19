alter table "public"."shops"
           add constraint "shops_dispatch_id_fkey"
           foreign key ("dispatch_id")
           references "public"."users"
           ("id") on update no action on delete no action;
