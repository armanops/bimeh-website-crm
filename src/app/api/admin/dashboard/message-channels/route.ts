import { NextRequest, NextResponse } from "next/server";
import { getMessageChannelDistribution } from "@/db/queries/dashboard";

export async function GET(request: NextRequest) {
  try {
    const distribution = await getMessageChannelDistribution();
    return NextResponse.json(distribution);
  } catch (error) {
    console.error("Error fetching message channel distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch message channel distribution" },
      { status: 500 }
    );
  }
}
