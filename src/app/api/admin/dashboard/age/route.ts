import { NextRequest, NextResponse } from "next/server";
import { getAgeDistribution } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const age = await getAgeDistribution();
    return NextResponse.json(age);
  } catch (error) {
    console.error("Error fetching age distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch age distribution" },
      { status: 500 }
    );
  }
}
