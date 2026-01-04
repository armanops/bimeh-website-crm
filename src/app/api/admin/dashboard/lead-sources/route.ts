import { NextRequest, NextResponse } from "next/server";
import { getLeadSourceDistribution } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const distribution = await getLeadSourceDistribution();
    return NextResponse.json(distribution);
  } catch (error) {
    console.error("Error fetching lead source distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch lead source distribution" },
      { status: 500 }
    );
  }
}
