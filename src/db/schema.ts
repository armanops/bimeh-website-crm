// db/schema.ts
// Database schema for BIM760 insurance platform
// Includes core entities, marketing outreach (leads/customers), and activity tracking

import {
  pgTable,
  serial,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  decimal,
  index,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Reusable timestamp columns
const timestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
};

// TypeScript union types for enums (replacing database enums)
export type UserRole = "customer" | "admin" | "super-admin";
export type QueueStatus = "pending" | "processing" | "sent" | "failed";
export type ActivityStatus = "pending" | "sent" | "failed";
export type MessageChannel =
  | "whatsapp"
  | "eita"
  | "telegram"
  | "bale"
  | "instagram"
  | "sms"
  | "email";
export type OutreachType =
  | "initial-contact"
  | "follow-up"
  | "reminder"
  | "promotion"
  | "custom";
export type LeadStatus = "lead" | "contacted" | "deactivated";
export type CustomerStatus =
  | "new"
  | "contacted"
  | "target"
  | "active"
  | "deactivated"
  | "marked";
export type UserType = "lead" | "customer";

// Tables

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  keywords: text("keywords"), // Comma-separated keywords for XLSX matching
  isActive: boolean("is_active").default(true),
  ...timestamps,
});

export const usersTable = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).unique().notNull(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  firstName: varchar("first_name", { length: 255 }),
  lastName: varchar("last_name", { length: 255 }),
  displayName: varchar("display_name", { length: 255 }),
  role: varchar("role", { length: 50 }).$type<UserRole>().default("customer"),
  isActive: boolean("is_active").default(true),
  ...timestamps,
});

export const smsQueuesTable = pgTable("sms_queues", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  phoneNumber: varchar("phone_number", { length: 20 }).notNull(),
  message: text("message").notNull(),
  status: varchar("status", { length: 20 })
    .$type<QueueStatus>()
    .default("pending"),
  attempts: integer("attempts").default(0),
  maxAttempts: integer("max_attempts").default(3),
  sentAt: timestamp("sent_at"),
  ...timestamps,
});

export const reminderTable = pgTable("reminders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => usersTable.id),
  productId: integer("product_id").references(() => productsTable.id),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  reminderDate: timestamp("reminder_date").notNull(),
  isCompleted: boolean("is_completed").default(false),
  ...timestamps,
});

// Leads: Imported raw contacts (before any outreach)
export const leadsTable = pgTable("leads", {
  id: serial("id").primaryKey(),
  firstName: varchar("first_name", { length: 255 }), // Can be null if fullName is provided
  lastName: varchar("last_name", { length: 255 }), // Can be null if fullName is provided
  fullName: varchar("full_name", { length: 510 }), // Combined first and last name
  phone: varchar("phone", { length: 20 }).unique().notNull(), // Normalized international format
  productId: integer("product_id").references(() => productsTable.id),
  source: varchar("source", { length: 255 }), // e.g., Excel filename or campaign
  importedBy: varchar("imported_by", { length: 255 }),
  status: varchar("status", { length: 20 }).$type<LeadStatus>().default("lead"),
  ...timestamps,
});

// Customers: Promoted from leads after first outreach or manual creation
export const customersTable = pgTable("customers", {
  id: serial("id").primaryKey(),
  leadId: integer("lead_id").references(() => leadsTable.id, {
    onDelete: "set null",
  }),
  firstName: varchar("first_name", { length: 255 }), // Can be null if fullName is provided
  lastName: varchar("last_name", { length: 255 }), // Can be null if fullName is provided
  fullName: varchar("full_name", { length: 510 }), // Combined first and last name
  phone: varchar("phone", { length: 20 }).unique().notNull(),
  source: varchar("source", { length: 255 }), // Source from lead or manual entry
  insuranceType: text("insurance_type"),
  preferredChannel: varchar("preferred_channel", { length: 20 })
    .$type<MessageChannel>()
    .default("whatsapp"),
  status: varchar("status", { length: 20 })
    .$type<CustomerStatus>()
    .default("contacted"),
  nationalId: varchar("national_id", { length: 10 }),
  birthCertificateNumber: varchar("birth_certificate_number", { length: 255 }),
  birthCertificateIssuancePlace: varchar("birth_certificate_issuance_place", {
    length: 255,
  }),
  placeOfBirth: varchar("place_of_birth", { length: 255 }),
  dateOfBirth: timestamp("date_of_birth"),
  telegramId: varchar("telegram_id", { length: 255 }),
  whatsappId: varchar("whatsapp_id", { length: 255 }),
  eitaId: varchar("eita_id", { length: 255 }),
  baleId: varchar("bale_id", { length: 255 }),
  email: varchar("email", { length: 255 }),
  gender: varchar("gender", { length: 10 }),
  maritalStatus: varchar("marital_status", { length: 20 }),
  numberOfChildren: integer("number_of_children"),
  militaryServiceStatus: varchar("military_service_status", { length: 50 }),
  occupation: varchar("occupation", { length: 255 }),
  landlinePhone: varchar("landline_phone", { length: 20 }),
  emergencyPhone: varchar("emergency_phone", { length: 20 }),
  emergencyPhoneRelation: varchar("emergency_phone_relation", { length: 255 }),
  residentialAddress: text("residential_address"),
  workAddress: text("work_address"),
  residentialPostalCode: varchar("residential_postal_code", { length: 10 }),
  ...timestamps,
});

// Free-form notes on customers
export const customerNotesTable = pgTable("customer_notes", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .references(() => customersTable.id, { onDelete: "cascade" })
    .notNull(),
  note: text("note").notNull(),
  ...timestamps,
});

// Message templates for reuse in outreach (product-specific with global fallback)
export const messageTemplatesTable = pgTable("message_templates", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  templateText: text("template_text").notNull(), // Supports placeholders like {نام}
  channel: varchar("channel", { length: 20 })
    .$type<MessageChannel>()
    .default("whatsapp")
    .notNull(),
  productId: integer("product_id").references(() => productsTable.id, {
    onDelete: "cascade",
  }), // Null for global templates
  isDefault: boolean("is_default").default(false), // One default per product/channel or global
  createdBy: varchar("created_by", { length: 255 }),
  ...timestamps,
});

// Messaging groups: Named collections of leads/customers for batch messaging
export const groupsTable = pgTable("groups", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  createdBy: varchar("created_by", { length: 255 }),
  ...timestamps,
});

// Group members: Many-to-many relationship between groups and users (leads/customers)
export const groupMembersTable = pgTable(
  "group_members",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id")
      .references(() => groupsTable.id, { onDelete: "cascade" })
      .notNull(),
    userId: integer("user_id").notNull(), // Can be lead or customer ID
    userType: varchar("user_type", { length: 10 }).$type<UserType>().notNull(),
    addedBy: varchar("added_by", { length: 255 }),
    ...timestamps,
  },
  (table) => ({
    uniqueGroupUser: index("unique_group_user").on(
      table.groupId,
      table.userId,
      table.userType
    ),
  })
);

// Activity log: Tracks all outreach messages (WhatsApp, SMS, etc.)
export const activitiesTable = pgTable("activities", {
  id: serial("id").primaryKey(),
  customerId: integer("customer_id")
    .references(() => customersTable.id, { onDelete: "cascade" })
    .notNull(),
  leadId: integer("lead_id").references(() => leadsTable.id, {
    onDelete: "set null",
  }), // Fallback if sent before customer creation
  messageText: text("message_text").notNull(),
  isAiGenerated: boolean("is_ai_generated").default(false),
  channel: varchar("channel", { length: 20 })
    .$type<MessageChannel>()
    .default("whatsapp")
    .notNull(),
  outreachType: varchar("outreach_type", { length: 20 })
    .$type<OutreachType>()
    .default("initial-contact"),
  templateUsed: text("template_used"), // Snapshot of template name or content
  sentAt: timestamp("sent_at"),
  sentBy: varchar("sent_by", { length: 255 }), // Admin who triggered send
  status: varchar("status", { length: 20 })
    .$type<ActivityStatus>()
    .default("pending")
    .notNull(),
  failureReason: text("failure_reason"),
  notes: text("notes"),
  ...timestamps,
});

// Type exports for use across the app
export type Product = typeof productsTable.$inferSelect;
export type NewProduct = typeof productsTable.$inferInsert;

export type User = typeof usersTable.$inferSelect;
export type NewUser = typeof usersTable.$inferInsert;

export type SmsQueue = typeof smsQueuesTable.$inferSelect;
export type NewSmsQueue = typeof smsQueuesTable.$inferInsert;

export type Reminder = typeof reminderTable.$inferSelect;
export type NewReminder = typeof reminderTable.$inferInsert;

export type Lead = typeof leadsTable.$inferSelect;
export type NewLead = typeof leadsTable.$inferInsert;

export type Customer = typeof customersTable.$inferSelect;
export type NewCustomer = typeof customersTable.$inferInsert;

export type CustomerNote = typeof customerNotesTable.$inferSelect;
export type NewCustomerNote = typeof customerNotesTable.$inferInsert;

export type MessageTemplate = typeof messageTemplatesTable.$inferSelect;
export type NewMessageTemplate = typeof messageTemplatesTable.$inferInsert;

export type Group = typeof groupsTable.$inferSelect;
export type NewGroup = typeof groupsTable.$inferInsert;

export type GroupMember = typeof groupMembersTable.$inferSelect;
export type NewGroupMember = typeof groupMembersTable.$inferInsert;

export type Activity = typeof activitiesTable.$inferSelect;
export type NewActivity = typeof activitiesTable.$inferInsert;
