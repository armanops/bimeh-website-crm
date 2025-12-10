import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  pgEnum,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Enums
export const productTypeEnum = pgEnum("product_type", [
  "car-insurance",
  "health-insurance",
  "home-insurance",
  "travel-insurance",
  "life-insurance",
]);

export const userRoleEnum = pgEnum("user_role", ["customer", "admin"]);

export const queueStatusEnum = pgEnum("queue_status", [
  "pending",
  "processing",
  "sent",
  "failed",
]);

// Tables
export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 255 }).unique().notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  type: productTypeEnum("type").notNull(),
  coveragePoints: text("coverage_points"), // JSON stored as text
  premiumStart: decimal("premium_start", { precision: 10, scale: 2 }),
  premiumEnd: decimal("premium_end", { precision: 10, scale: 2 }),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  phone: varchar("phone", { length: 20 }),
  fullName: varchar("full_name", { length: 255 }),
  role: userRoleEnum("role").default("customer"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").default(sql`now()`),
  updatedAt: timestamp("updated_at").default(sql`now()`),
});

export const smsQueuesTable = pgTable("sms_queues", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  message: text("message").notNull(),
  status: queueStatusEnum("status").default("pending"),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  sentAt: timestamp("sent_at"),
  createdAt: timestamp("created_at").default(sql`now()`),
});

export const reminderTable = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  productId: integer("product_id").references(() => productsTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  reminderDate: timestamp("reminder_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  createdAt: timestamp("created_at").default(sql`now()`),
});

// Types for use in application
export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type SmsQueue = typeof smsQueuesTable.$inferSelect;
export type NewSmsQueue = typeof smsQueuesTable.$inferInsert;

export type Reminder = typeof reminderTable.$inferSelect;
export type NewReminder = typeof reminderTable.$inferInsert;
