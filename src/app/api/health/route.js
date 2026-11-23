import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server";
export const dynamic = "force-dynamic";
export async function GET() {
    const backend = await serverFetch("health");
    return NextResponse.json({
        success: true,
        message: "BERA frontend is healthy",
        backend: backend.success,
        timestamp: new Date().toISOString(),
    });
}
