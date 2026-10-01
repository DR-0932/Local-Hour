import { NextResponse } from "next/server";
import { getUser } from "@/lib/auth";
import { createEvent } from "@/lib/controllers/adminControllers";

export async function POST(req: Request) {
  const user = await getUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const result = await createEvent(body, user);
  return NextResponse.json(result.data, { status: result.status });
}