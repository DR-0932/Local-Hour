import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { register_for_free_event } from "@/lib/controllers/businessControllers";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await register_for_free_event(body);

  if (result.status >= 200 && result.status < 300) {
    revalidateTag("events","max");
    if (body?.eventId) revalidateTag(`event-${body.eventId}`,"max");
  }

  return NextResponse.json(result.data, { status: result.status });
}