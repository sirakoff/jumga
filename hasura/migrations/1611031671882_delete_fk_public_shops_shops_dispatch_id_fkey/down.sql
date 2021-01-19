alter table "public"."shops" add foreign key ("dispatch_id") references "public"."users"("id") on update no action on delete no action;
