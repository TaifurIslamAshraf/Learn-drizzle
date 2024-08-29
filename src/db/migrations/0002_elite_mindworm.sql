CREATE TABLE IF NOT EXISTS "userInfo" (
	"id" serial PRIMARY KEY NOT NULL,
	"meta" jsonb,
	"userId" integer
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "userInfo" ADD CONSTRAINT "userInfo_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
