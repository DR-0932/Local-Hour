import { NextResponse } from "next/server";
import { getEvents } from "@/lib/controllers/businessControllers";

export async function GET() {
  const result = await getEvents();
  return NextResponse.json(result.data, { status: result.status });
}