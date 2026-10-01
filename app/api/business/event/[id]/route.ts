import { NextResponse } from "next/server";
import { getEventById } from "@/lib/controllers/businessControllers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const result = await getEventById(id);
  return NextResponse.json(result.data, { status: result.status });
}