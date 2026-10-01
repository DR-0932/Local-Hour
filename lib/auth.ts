import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function getUser(_req?: Request) {
  const token = (await cookies()).get("token")?.value;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    return { id: decoded.id };
  } catch {
    return null;
  }
}

export async function getAdmin() {
  const user = await getUser();
  if (!user){
      return { status: 401 as const };
  } 
  const db = await prisma.user.findUnique({
    where: { 
        id: user.id
    },
    select: { 
        role: true
    },
  });
  if (db?.role !== "Admin") {
      return { status: 403 as const };
  }
  return { status: 200 as const, user };
}