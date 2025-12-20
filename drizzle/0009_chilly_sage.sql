ALTER TABLE "activities" ALTER COLUMN "channel" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "channel" SET DEFAULT 'whatsapp';--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "outreach_type" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "outreach_type" SET DEFAULT 'initial-contact';--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "activities" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "preferred_channel" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "preferred_channel" SET DEFAULT 'whatsapp';--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "customers" ALTER COLUMN "status" SET DEFAULT 'contacted';--> statement-breakpoint
ALTER TABLE "group_members" ALTER COLUMN "user_type" SET DATA TYPE varchar(10);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "leads" ALTER COLUMN "status" SET DEFAULT 'lead';--> statement-breakpoint
ALTER TABLE "message_templates" ALTER COLUMN "channel" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "message_templates" ALTER COLUMN "channel" SET DEFAULT 'whatsapp';--> statement-breakpoint
ALTER TABLE "sms_queues" ALTER COLUMN "status" SET DATA TYPE varchar(20);--> statement-breakpoint
ALTER TABLE "sms_queues" ALTER COLUMN "status" SET DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE varchar(50);--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'customer';--> statement-breakpoint
DROP TYPE "public"."activity_status";--> statement-breakpoint
DROP TYPE "public"."customer_status";--> statement-breakpoint
DROP TYPE "public"."lead_status";--> statement-breakpoint
DROP TYPE "public"."message_channel";--> statement-breakpoint
DROP TYPE "public"."outreach_type";--> statement-breakpoint
DROP TYPE "public"."queue_status";--> statement-breakpoint
DROP TYPE "public"."user_role";