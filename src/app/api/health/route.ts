import { NextResponse } from "next/server";
import { db } from "@/db";

export async function GET() {
  try {
    // Simple database health check
    await db.execute("SELECT 1");
    return NextResponse.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error("Health check failed:", error);
    return NextResponse.json(
      { status: "error", database: "disconnected" },
      { status: 500 }
    );
  }
}
