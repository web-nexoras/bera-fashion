import { NextResponse } from "next/server";
import { serverFetch } from "@/lib/api/server";
export const dynamic = "force-dynamic";
export async function GET() {
    const backend = await serverFetch("health");
    const backendAvailable = backend.success;
    return NextResponse.json({
        success: backendAvailable,
        message: backendAvailable ? "BERA frontend and backend are healthy" : "BERA frontend is running but the backend is unavailable",
        backend: backendAvailable,
        timestamp: new Date().toISOString(),
    }, { status: backendAvailable ? 200 : 503 });
}
