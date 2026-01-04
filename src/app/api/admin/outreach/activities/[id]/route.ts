import { NextRequest, NextResponse } from "next/server";
import { updateActivity, deleteActivity } from "@/db/queries/activities";
import { auth } from "@/lib/auth";
import type { NewActivity } from "@/db/schema";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const activityId = parseInt(idParam);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const data = await request.json();

    // Ensure proper types for update
    const updateData: Partial<NewActivity> = {};

    if (data.messageText !== undefined)
      updateData.messageText = data.messageText;
    if (data.channel !== undefined) updateData.channel = data.channel;
    if (data.outreachType !== undefined)
      updateData.outreachType = data.outreachType;
    if (data.status !== undefined) updateData.status = data.status;
    if (data.sentBy !== undefined) updateData.sentBy = data.sentBy;
    if (data.notes !== undefined) updateData.notes = data.notes;
    if (data.isAiGenerated !== undefined)
      updateData.isAiGenerated = Boolean(data.isAiGenerated);
    if (data.templateUsed !== undefined)
      updateData.templateUsed = data.templateUsed;
    if (data.failureReason !== undefined)
      updateData.failureReason = data.failureReason;
    if (data.sentAt !== undefined) {
      updateData.sentAt =
        typeof data.sentAt === "string" ? new Date(data.sentAt) : data.sentAt;
    }

    const activity = await updateActivity(activityId, updateData);

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ activity });
  } catch (error) {
    console.error("Error updating activity:", error);
    return NextResponse.json(
      { error: "Failed to update activity" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: idParam } = await params;
    const activityId = parseInt(idParam);

    if (isNaN(activityId)) {
      return NextResponse.json(
        { error: "Invalid activity ID" },
        { status: 400 }
      );
    }

    const activity = await deleteActivity(activityId);

    if (!activity) {
      return NextResponse.json(
        { error: "Activity not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Activity deleted successfully" });
  } catch (error) {
    console.error("Error deleting activity:", error);
    return NextResponse.json(
      { error: "Failed to delete activity" },
      { status: 500 }
    );
  }
}
