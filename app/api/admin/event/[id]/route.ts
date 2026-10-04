import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getAdmin } from "@/lib/auth";
import { deleteEvent } from "@/lib/controllers/adminControllers";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await getAdmin();
  if (admin.status !== 200)
    return NextResponse.json({ error: "Forbidden" }, { status: admin.status });

  const { id } = await params;
  const result = await deleteEvent(id);

  if (result.status >= 200 && result.status < 300) {
    revalidateTag("events", "max");
    revalidateTag(`event-${id}`, "max");
  }

  return NextResponse.json(result.data, { status: result.status });
}