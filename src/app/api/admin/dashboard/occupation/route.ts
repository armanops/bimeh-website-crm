import { NextRequest, NextResponse } from "next/server";
import { getOccupationDistribution } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const occupation = await getOccupationDistribution();
    return NextResponse.json(occupation);
  } catch (error) {
    console.error("Error fetching occupation distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch occupation distribution" },
      { status: 500 }
    );
  }
}
