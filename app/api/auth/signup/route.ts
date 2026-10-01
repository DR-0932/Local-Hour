import { NextResponse } from "next/server";
import { signup } from "@/lib/controllers/authControllers";

export async function POST(req: Request) {
  const body = await req.json();
  const result = await signup(body);
  return NextResponse.json(result.data, { status: result.status });
}