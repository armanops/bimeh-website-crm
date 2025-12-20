"use server";

import { revalidatePath } from "next/cache";
import { convertLeadToCustomer, updateCustomer } from "@/db/queries/customers";
import { updateLead } from "@/db/queries/leads";
import { db } from "@/db";
import { activitiesTable } from "@/db/schema";

export async function convertLeadToCustomerAction(leadId: number) {
  try {
    const customer = await convertLeadToCustomer(leadId, {
      status: "new",
    });
    revalidatePath("/admin/outreach/leads");
    revalidatePath("/admin/outreach/customers");
    return { success: true, customer };
  } catch (error) {
    console.error("Error converting lead to customer:", error);
    return { success: false, error: "Failed to convert lead" };
  }
}

export async function markLeadAsContacted(leadId: number, adminId?: string) {
  try {
    // Update lead status
    await updateLead(leadId, { status: "contacted" as const });

    // TODO: Log activity after customer creation

    revalidatePath("/admin/outreach/leads");
    return { success: true };
  } catch (error) {
    console.error("Error marking lead as contacted:", error);
    return { success: false, error: "Failed to mark as contacted" };
  }
}

export async function updateLeadStatus(leadId: number, status: string) {
  try {
    await updateLead(leadId, {
      status: status as "lead" | "contacted" | "deactivated",
    });
    revalidatePath("/admin/outreach/leads");
    return { success: true };
  } catch (error) {
    console.error("Error updating lead status:", error);
    return { success: false, error: "Failed to update status" };
  }
}

export async function updateCustomerStatus(customerId: number, status: string) {
  try {
    await updateCustomer(customerId, {
      status: status as
        | "new"
        | "contacted"
        | "target"
        | "active"
        | "deactivated",
    });
    revalidatePath("/admin/outreach/customers");
    return { success: true };
  } catch (error) {
    console.error("Error updating customer status:", error);
    return { success: false, error: "Failed to update status" };
  }
}
