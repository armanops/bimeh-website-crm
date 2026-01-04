import { db } from "@/db";
import { leadsTable, productsTable } from "@/db/schema";
import { eq, like, or, and, desc, asc, sql, inArray } from "drizzle-orm";
import type { Lead, NewLead, LeadStatus } from "@/db/schema";
import { normalizePhoneNumber } from "../../lib/phone-utils";

// Get all leads with optional pagination and search
export async function getLeads({
  page = 1,
  limit = 10,
  search,
  sortBy = "createdAt",
  sortOrder = "desc",
  source,
  status,
  productId,
}: {
  page?: number;
  limit?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  source?: string;
  status?: string;
  productId?: string;
} = {}) {
  const offset = (page - 1) * limit;

  let whereClause = undefined;
  const conditions = [];

  if (search) {
    const normalizedSearch = normalizePhoneNumber(search);
    conditions.push(
      or(
        like(leadsTable.firstName, `%${search}%`),
        like(leadsTable.lastName, `%${search}%`),
        like(leadsTable.phone, `%${normalizedSearch}%`)
      )
    );
  }

  if (source && source !== "all") {
    conditions.push(eq(leadsTable.source, source));
  }

  if (status && status !== "all") {
    conditions.push(eq(leadsTable.status, status as LeadStatus));
  }

  if (productId && productId !== "all") {
    conditions.push(eq(leadsTable.productId, parseInt(productId)));
  }

  if (conditions.length > 0) {
    whereClause = conditions.length === 1 ? conditions[0] : and(...conditions);
  }

  const orderBy = sortOrder === "desc" ? desc : asc;
  let orderColumn;
  switch (sortBy) {
    case "firstName":
      orderColumn = orderBy(leadsTable.firstName);
      break;
    case "lastName":
      orderColumn = orderBy(leadsTable.lastName);
      break;
    case "phone":
      orderColumn = orderBy(leadsTable.phone);
      break;
    case "createdAt":
    default:
      orderColumn = orderBy(leadsTable.createdAt);
      break;
  }

  const leads = await db
    .select({
      id: leadsTable.id,
      firstName: leadsTable.firstName,
      lastName: leadsTable.lastName,
      phone: leadsTable.phone,
      productId: leadsTable.productId,
      source: leadsTable.source,
      importedBy: leadsTable.importedBy,
      status: leadsTable.status,
      createdAt: leadsTable.createdAt,
      updatedAt: leadsTable.updatedAt,
      product: {
        id: productsTable.id,
        name: productsTable.name,
      },
    })
    .from(leadsTable)
    .leftJoin(productsTable, eq(leadsTable.productId, productsTable.id))
    .where(whereClause)
    .orderBy(orderColumn)
    .limit(limit)
    .offset(offset);

  // Get total count for pagination
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)` })
    .from(leadsTable)
    .where(whereClause);

  return {
    leads,
    total: count,
    page,
    limit,
    totalPages: Math.ceil(count / limit),
  };
}

// Get lead by ID
export async function getLeadById(id: number) {
  const [lead] = await db
    .select({
      id: leadsTable.id,
      firstName: leadsTable.firstName,
      lastName: leadsTable.lastName,
      phone: leadsTable.phone,
      productId: leadsTable.productId,
      source: leadsTable.source,
      importedBy: leadsTable.importedBy,
      status: leadsTable.status,
      createdAt: leadsTable.createdAt,
      updatedAt: leadsTable.updatedAt,
      product: {
        id: productsTable.id,
        name: productsTable.name,
      },
    })
    .from(leadsTable)
    .leftJoin(productsTable, eq(leadsTable.productId, productsTable.id))
    .where(eq(leadsTable.id, id))
    .limit(1);

  return lead || null;
}

// Create new lead
export async function createLead(data: NewLead) {
  const [lead] = await db.insert(leadsTable).values(data).returning();
  return lead;
}

// Update lead
export async function updateLead(id: number, data: Partial<NewLead>) {
  const [lead] = await db
    .update(leadsTable)
    .set(data)
    .where(eq(leadsTable.id, id))
    .returning();
  return lead;
}

// Delete lead
export async function deleteLead(id: number) {
  const [lead] = await db
    .delete(leadsTable)
    .where(eq(leadsTable.id, id))
    .returning();
  return lead;
}

// Bulk delete leads
export async function deleteLeads(ids: number[]) {
  await db.delete(leadsTable).where(sql`${leadsTable.id} IN ${ids}`);
}

// Get leads by IDs
export async function getLeadsByIds(ids: number[]) {
  if (ids.length === 0) return [];

  return await db
    .select({
      id: leadsTable.id,
      firstName: leadsTable.firstName,
      lastName: leadsTable.lastName,
      phone: leadsTable.phone,
      productId: leadsTable.productId,
      source: leadsTable.source,
      importedBy: leadsTable.importedBy,
      status: leadsTable.status,
      createdAt: leadsTable.createdAt,
      updatedAt: leadsTable.updatedAt,
      product: {
        id: productsTable.id,
        name: productsTable.name,
      },
    })
    .from(leadsTable)
    .leftJoin(productsTable, eq(leadsTable.productId, productsTable.id))
    .where(inArray(leadsTable.id, ids));
}

// Get unique sources for filtering
export async function getUniqueLeadSources() {
  const sources = await db
    .selectDistinct({ source: leadsTable.source })
    .from(leadsTable);

  return sources.map((s) => s.source).filter(Boolean);
}

// Get unique statuses for filtering
export async function getUniqueLeadStatuses() {
  const statuses = await db
    .selectDistinct({ status: leadsTable.status })
    .from(leadsTable);

  return statuses.map((s) => s.status);
}
