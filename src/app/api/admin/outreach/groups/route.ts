import { NextRequest, NextResponse } from "next/server";
import { getGroups, createGroup } from "@/db/queries/groups";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    const groups = await getGroups();

    // Simple pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedGroups = groups.slice(startIndex, endIndex);

    // Add member counts (simplified - in production you'd join with group_members)
    const groupsWithCounts = await Promise.all(
      paginatedGroups.map(async (group) => {
        // This is a simplified count - you'd optimize this in production
        const { getGroupMembers } = await import("@/db/queries/groups");
        const members = await getGroupMembers(group.id);
        return {
          ...group,
          _count: {
            members: members.length,
          },
        };
      })
    );

    return NextResponse.json({
      groups: groupsWithCounts,
      total: groups.length,
      page,
      limit,
      totalPages: Math.ceil(groups.length / limit),
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    return NextResponse.json(
      { error: "Failed to fetch groups" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, createdBy } = body;

    if (!name || typeof name !== "string") {
      return NextResponse.json(
        { error: "Group name is required" },
        { status: 400 }
      );
    }

    const group = await createGroup({
      name: name.trim(),
      description: description?.trim(),
      createdBy,
    });

    return NextResponse.json({ group }, { status: 201 });
  } catch (error) {
    console.error("Error creating group:", error);
    return NextResponse.json(
      { error: "Failed to create group" },
      { status: 500 }
    );
  }
}
