CREATE TABLE "data_blobs" (
	"id" text PRIMARY KEY NOT NULL,
	"sensor_id" text NOT NULL,
	"blob_name" text NOT NULL,
	"merkle_root" text NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"data_points" integer DEFAULT 0 NOT NULL,
	"size_bytes" integer DEFAULT 0 NOT NULL,
	"storage_duration" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ingest_buffer" (
	"id" text PRIMARY KEY NOT NULL,
	"sensor_id" text NOT NULL,
	"timestamp" timestamp NOT NULL,
	"values" jsonb NOT NULL,
	"unit" text DEFAULT '' NOT NULL,
	"processed" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sensors" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"type" text NOT NULL,
	"owner_id" text NOT NULL,
	"api_key" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"location_lat" real,
	"location_lng" real,
	"location_label" text,
	"pricing_per_read" real DEFAULT 0.001 NOT NULL,
	"pricing_hourly" real DEFAULT 0.5 NOT NULL,
	"pricing_daily" real DEFAULT 5 NOT NULL,
	"pricing_monthly" real DEFAULT 50 NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"id" text PRIMARY KEY NOT NULL,
	"buyer_id" text NOT NULL,
	"sensor_id" text NOT NULL,
	"plan" text NOT NULL,
	"status" text DEFAULT 'active' NOT NULL,
	"start_time" timestamp NOT NULL,
	"end_time" timestamp NOT NULL,
	"tx_hash" text NOT NULL,
	"amount_paid" real NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"chain_type" text DEFAULT 'ethereum' NOT NULL,
	"display_name" text,
	"avatar" text,
	"role" text DEFAULT 'user' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "data_blobs" ADD CONSTRAINT "data_blobs_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ingest_buffer" ADD CONSTRAINT "ingest_buffer_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sensors" ADD CONSTRAINT "sensors_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_buyer_id_users_id_fk" FOREIGN KEY ("buyer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "subscriptions_sensor_id_sensors_id_fk" FOREIGN KEY ("sensor_id") REFERENCES "public"."sensors"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "blobs_sensor_idx" ON "data_blobs" USING btree ("sensor_id");--> statement-breakpoint
CREATE INDEX "blobs_time_idx" ON "data_blobs" USING btree ("start_time","end_time");--> statement-breakpoint
CREATE INDEX "ingest_sensor_idx" ON "ingest_buffer" USING btree ("sensor_id");--> statement-breakpoint
CREATE INDEX "ingest_processed_idx" ON "ingest_buffer" USING btree ("processed");--> statement-breakpoint
CREATE INDEX "sensors_owner_idx" ON "sensors" USING btree ("owner_id");--> statement-breakpoint
CREATE INDEX "sensors_type_idx" ON "sensors" USING btree ("type");--> statement-breakpoint
CREATE INDEX "sensors_status_idx" ON "sensors" USING btree ("status");--> statement-breakpoint
CREATE INDEX "subs_buyer_idx" ON "subscriptions" USING btree ("buyer_id");--> statement-breakpoint
CREATE INDEX "subs_sensor_idx" ON "subscriptions" USING btree ("sensor_id");--> statement-breakpoint
CREATE INDEX "subs_status_idx" ON "subscriptions" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "users_wallet_idx" ON "users" USING btree ("wallet_address");