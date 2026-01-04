import { NextRequest, NextResponse } from "next/server";
import { getTemplateUsageAnalytics } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const templates = await getTemplateUsageAnalytics();
    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching template usage analytics:", error);
    return NextResponse.json(
      { error: "Failed to fetch template usage analytics" },
      { status: 500 }
    );
  }
}
