import { NextRequest, NextResponse } from "next/server";
import { getMilitaryServiceDistribution } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const military = await getMilitaryServiceDistribution();
    return NextResponse.json(military);
  } catch (error) {
    console.error("Error fetching military service distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch military service distribution" },
      { status: 500 }
    );
  }
}
