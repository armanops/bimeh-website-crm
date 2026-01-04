import { NextRequest, NextResponse } from "next/server";
import { getLeadStatusDistribution } from "@/db/queries/dashboard";

export async function GET(request: NextRequest) {
  try {
    const distribution = await getLeadStatusDistribution();
    return NextResponse.json(distribution);
  } catch (error) {
    console.error("Error fetching lead status distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead status distribution" },
      { status: 500 }
    );
  }
}
