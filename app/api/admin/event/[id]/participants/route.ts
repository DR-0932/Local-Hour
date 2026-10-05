import { NextResponse } from "next/server";
import { getAdmin } from "@/lib/auth";
import { getParticipants } from "@/lib/controllers/adminControllers";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (admin.status !== 200)
    return NextResponse.json({ error: "Forbidden" }, { status: admin.status });
  const { id } = await params;
  const result = await getParticipants(id);
  return NextResponse.json(result.data, { status: result.status });
}
