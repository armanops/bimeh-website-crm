import { NextRequest, NextResponse } from "next/server";
import { getCustomerLifecycleMetrics } from "@/db/queries/bi-metrics";

export async function GET(request: NextRequest) {
  try {
    const lifecycle = await getCustomerLifecycleMetrics();
    return NextResponse.json(lifecycle);
  } catch (error) {
    console.error("Error fetching customer lifecycle metrics:", error);
    return NextResponse.json(
      { error: "Failed to fetch customer lifecycle metrics" },
      { status: 500 }
    );
  }
}
