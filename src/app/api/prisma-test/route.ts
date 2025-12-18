// app/api/admin/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { generateJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({ where: { username } });
    if (!admin) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const isValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isValid) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });

    const token = generateJWT({ id: admin.id, username: admin.username, role: admin.role });

    return NextResponse.json({ token, username: admin.username, role: admin.role });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
