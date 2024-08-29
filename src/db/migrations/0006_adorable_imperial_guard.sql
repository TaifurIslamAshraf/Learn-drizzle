CREATE TABLE IF NOT EXISTS "groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "usersToGroups" (
	"userId" integer NOT NULL,
	"groupId" integer NOT NULL,
	CONSTRAINT "usersToGroups_userId_groupId_pk" PRIMARY KEY("userId","groupId")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToGroups" ADD CONSTRAINT "usersToGroups_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "usersToGroups" ADD CONSTRAINT "usersToGroups_groupId_groups_id_fk" FOREIGN KEY ("groupId") REFERENCES "public"."groups"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "userIdIndex" ON "usersToGroups" USING btree ("userId");