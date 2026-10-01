import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { prisma } from "@/lib/prisma";
import { login_schema, signup_schema } from "@/lib/validation";

type Result = { status: number; data: any; token?: string };

export async function signup(body: unknown): Promise<Result> {
  const parsed = signup_schema.safeParse(body);
  
  if (!parsed.success){ 
    return { status: 400, data: { error: "invalid data" } };
  }
  
  const { username, name, password, email, gender,role } = parsed.data;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = await prisma.user.create({
      data: { 
        username, 
        password: hashedPassword, 
        name, 
        email, 
        gender,
        role
    },
    });
    
    const { password: _, ...safeUser } = user;
    return { status: 201, data: { userdata: safeUser } };
  
} catch (err: any) {
    console.error("Signup error details:", err);
    return { status: 500, data: { error: err.message || "Internal server error" } };
  }
}

export async function login(body: unknown): Promise<Result> {
  const parsed = login_schema.safeParse(body);
  if (!parsed.success) {
    return { status: 400, data: { error: "invalid data" } }
    };
  
    const { loginIdentifier, password } = parsed.data;

  try {
    const user = await prisma.user.findFirst({
      where: { 
        OR: [{ username: loginIdentifier }, { email: loginIdentifier }] 
    },
    });
    
    if (!user) {
        return { status: 404, data: { error: "user not found" } }
    };

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        return { status: 401, data: { error: "Invalid username or password" } }
    };

    const token = jwt.sign(
        { id: user.id }, 
        process.env.JWT_SECRET!, 
        { expiresIn: "1d" }
    );
    const { password: _, ...safeUser } = user;
    return { status: 200, data: { token, userdata: safeUser }, token };
  
} catch (err) {
    console.error(err);
    return { status: 500, data: { error: "internal server error" } };
  }
}