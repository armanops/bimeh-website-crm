import { NextRequest, NextResponse } from "next/server";
import { getCampaignPerformanceMetrics } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const campaigns = await getCampaignPerformanceMetrics();
    return NextResponse.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaign performance metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch campaign performance metrics" },
      { status: 500 }
    );
  }
}
