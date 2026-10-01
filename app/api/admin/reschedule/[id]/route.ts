import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { rescheduleEvent } from "@/lib/controllers/adminControllers";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (admin.status !== 200)
    return NextResponse.json({ error: "Forbidden" }, { status: admin.status });
  const { id } = await params;
  const body = await req.json().catch(() => null);
  const result = await rescheduleEvent(id, body);
  return NextResponse.json(result.data, { status: result.status });
}