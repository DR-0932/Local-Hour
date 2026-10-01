import { NextResponse } from "next/server";
import { login } from "@/lib/controllers/authControllers";

export async function POST(req: Request) {
  const body = await req.json();
  
  const result = await login(body);
  
  const res = NextResponse.json(result.data, { status: result.status });
  if (result.token) {
    res.cookies.set("token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24,
    });
  }
  return res;
}