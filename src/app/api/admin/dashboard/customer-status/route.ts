import { NextRequest, NextResponse } from "next/server";
import { getCustomerStatusDistribution } from "@/db/queries/dashboard";

export async function GET(request: NextRequest) {
  try {
    const distribution = await getCustomerStatusDistribution();
    return NextResponse.json(distribution);
  } catch (error) {
    console.error("Error fetching customer status distribution:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer status distribution" },
      { status: 500 }
    );
  }
}
