import { NextRequest, NextResponse } from "next/server";
import { getGeographicDistribution } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const geographic = await getGeographicDistribution();
    return NextResponse.json(geographic);
  } catch (error) {
    console.error("Error fetching geographic distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch geographic distribution" },
      { status: 500 }
    );
  }
}
