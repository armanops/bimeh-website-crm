import { NextRequest, NextResponse } from "next/server";
import { getCustomerDemographics } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const demographics = await getCustomerDemographics();
    return NextResponse.json(demographics);
  } catch (error) {
    console.error("Error fetching customer demographics:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer demographics" },
      { status: 500 }
    );
  }
}
