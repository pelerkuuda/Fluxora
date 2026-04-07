// Fluxora Database Schema
// PostgreSQL with Drizzle ORM

import {
  pgTable,
  text,
  timestamp,
  integer,
  real,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { nanoid } from "nanoid";

// ─── Users ───────────────────────────────────────────────
export const users = pgTable(
  "users",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    walletAddress: text("wallet_address").notNull(),
    chainType: text("chain_type").notNull().default("ethereum"), // ethereum | solana | aptos
    displayName: text("display_name"),
    avatar: text("avatar"),
    role: text("role").notNull().default("user"), // user | producer | admin
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("users_wallet_idx").on(table.walletAddress),
  ]
);

// ─── Sensors ─────────────────────────────────────────────
export const sensors = pgTable(
  "sensors",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    name: text("name").notNull(),
    description: text("description").notNull().default(""),
    type: text("type").notNull(), // SensorType
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id),
    apiKey: text("api_key")
      .notNull()
      .$defaultFn(() => `flx_${nanoid(32)}`),
    status: text("status").notNull().default("active"),
    locationLat: real("location_lat"),
    locationLng: real("location_lng"),
    locationLabel: text("location_label"),
    pricingPerRead: real("pricing_per_read").notNull().default(0.001),
    pricingHourly: real("pricing_hourly").notNull().default(0.5),
    pricingDaily: real("pricing_daily").notNull().default(5),
    pricingMonthly: real("pricing_monthly").notNull().default(50),
    metadata: jsonb("metadata").default({}),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    index("sensors_owner_idx").on(table.ownerId),
    index("sensors_type_idx").on(table.type),
    index("sensors_status_idx").on(table.status),
  ]
);

// ─── Data Blobs ──────────────────────────────────────────
export const dataBlobs = pgTable(
  "data_blobs",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    sensorId: text("sensor_id")
      .notNull()
      .references(() => sensors.id),
    blobName: text("blob_name").notNull(),
    merkleRoot: text("merkle_root").notNull(),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    dataPoints: integer("data_points").notNull().default(0),
    sizeBytes: integer("size_bytes").notNull().default(0),
    storageDuration: integer("storage_duration").notNull().default(100),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("blobs_sensor_idx").on(table.sensorId),
    index("blobs_time_idx").on(table.startTime, table.endTime),
  ]
);

// ─── Subscriptions ───────────────────────────────────────
export const subscriptions = pgTable(
  "subscriptions",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    buyerId: text("buyer_id")
      .notNull()
      .references(() => users.id),
    sensorId: text("sensor_id")
      .notNull()
      .references(() => sensors.id),
    plan: text("plan").notNull(), // per_read | hourly | daily | monthly
    status: text("status").notNull().default("active"),
    startTime: timestamp("start_time").notNull(),
    endTime: timestamp("end_time").notNull(),
    txHash: text("tx_hash").notNull(),
    amountPaid: real("amount_paid").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("subs_buyer_idx").on(table.buyerId),
    index("subs_sensor_idx").on(table.sensorId),
    index("subs_status_idx").on(table.status),
  ]
);

// ─── Ingest Buffer ───────────────────────────────────────
// Temporary storage before batching into Shelby blobs
export const ingestBuffer = pgTable(
  "ingest_buffer",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => nanoid()),
    sensorId: text("sensor_id")
      .notNull()
      .references(() => sensors.id),
    timestamp: timestamp("timestamp").notNull(),
    values: jsonb("values").notNull(),
    unit: text("unit").notNull().default(""),
    processed: boolean("processed").notNull().default(false),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => [
    index("ingest_sensor_idx").on(table.sensorId),
    index("ingest_processed_idx").on(table.processed),
  ]
);
