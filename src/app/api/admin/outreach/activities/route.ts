import { NextRequest, NextResponse } from "next/server";
import {
  getActivities,
  createActivity,
  updateActivity,
  deleteActivity,
} from "@/db/queries/activities";
import { auth } from "@/lib/auth";
import type { NewActivity } from "@/db/schema";

export async function GET(request: NextRequest) {
  try {
    // Note: This route doesn't use params, so no need to await them
    const session = await auth();
    if (!session) {
      console.log("Unauthorized access to activities");
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const search = searchParams.get("search") || undefined;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = (searchParams.get("sortOrder") || "desc") as
      | "asc"
      | "desc";
    const customerId = searchParams.get("customerId")
      ? parseInt(searchParams.get("customerId")!)
      : undefined;
    const leadId = searchParams.get("leadId")
      ? parseInt(searchParams.get("leadId")!)
      : undefined;
    const channel = searchParams.get("channel") || undefined;
    const status = searchParams.get("status") || undefined;

    const result = await getActivities({
      page,
      limit,
      search,
      sortBy,
      sortOrder,
      customerId,
      leadId,
      channel,
      status,
    });

    // For customer-specific activity requests, return just the activities array
    // For general activity requests, return the full pagination object
    if (customerId) {
      console.log(
        "Returning customer-specific activities:",
        result.activities.length
      );
      return NextResponse.json({
        activities: result.activities,
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching activities:", error);
    return NextResponse.json(
      { error: "Failed to fetch activities" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await request.json();

    // Validate required fields
    if (!data.customerId || !data.messageText) {
      return NextResponse.json(
        { error: "شماره مشتری و متن پیام الزامی است" },
        { status: 400 }
      );
    }

    // Ensure sentAt is set as a Date object, not string
    if (!data.sentAt) {
      data.sentAt = new Date();
    } else if (typeof data.sentAt === "string") {
      data.sentAt = new Date(data.sentAt);
    }

    // Ensure required fields have proper types
    const activityData = {
      ...data,
      customerId: Number(data.customerId),
      isAiGenerated: Boolean(data.isAiGenerated),
      channel: data.channel || "whatsapp",
      outreachType: data.outreachType || "initial-contact",
      status: data.status || "pending",
    };

    console.log("Creating activity with data:", activityData);
    const activity = await createActivity(activityData);
    console.log("Activity created successfully:", activity);
    return NextResponse.json({ activity }, { status: 201 });
  } catch (error) {
    console.error("Error creating activity:", error);
    return NextResponse.json(
      { error: "Failed to create activity", details: (error as Error).message },
      { status: 500 }
    );
  }
}
