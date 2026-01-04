import { NextRequest, NextResponse } from "next/server";
import {
  getLeads,
  createLead,
  getUniqueLeadSources,
  getUniqueLeadStatuses,
} from "@/db/queries/leads";
import { db } from "@/db";
import { leadsTable, customersTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { normalizePhoneNumber } from "@/lib/phone-utils";
import { validatePhoneNumber } from "@/lib/phone-validation";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");

    if (type === "sources") {
      const sources = await getUniqueLeadSources();
      return NextResponse.json({ sources });
    } else if (type === "statuses") {
      const statuses = await getUniqueLeadStatuses();
      return NextResponse.json({ statuses });
    } else {
      // Default to regular leads list
      const page = parseInt(searchParams.get("page") || "1");
      const limit = parseInt(searchParams.get("limit") || "10");
      const search = searchParams.get("search") || "";
      const sortBy = searchParams.get("sortBy") || "createdAt";
      const sortOrder = searchParams.get("sortOrder") || "desc";
      const source = searchParams.get("source") || "";
      const status = searchParams.get("status") || "";
      const productId = searchParams.get("productId") || "";

      const result = await getLeads({
        page,
        limit,
        search,
        sortBy,
        sortOrder: sortOrder as "asc" | "desc",
        source,
        status,
        productId,
      });

      return NextResponse.json(result);
    }
  } catch (error) {
    console.error("Error fetching leads:", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Normalize and validate phone number
    const validation = validatePhoneNumber(body.phone);
    if (!validation.success) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }
    const normalizedPhone = validation.data!;

    // Check if phone number already exists in leads or customers
    const existingLead = await db
      .select()
      .from(leadsTable)
      .where(eq(leadsTable.phone, normalizedPhone))
      .limit(1);

    const existingCustomer = await db
      .select()
      .from(customersTable)
      .where(eq(customersTable.phone, normalizedPhone))
      .limit(1);

    if (existingLead.length > 0 || existingCustomer.length > 0) {
      return NextResponse.json(
        { error: "شماره تلفن تکراری است" },
        { status: 400 }
      );
    }

    const lead = await createLead({ ...body, phone: normalizedPhone });
    return NextResponse.json(lead, { status: 201 });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { error: "Failed to create lead" },
      { status: 500 }
    );
  }
}
