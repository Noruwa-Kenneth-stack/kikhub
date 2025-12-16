import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface UpdateData {
  username?: string;
  passwordHash?: string;
  role?: string;
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, username, role, password } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData: UpdateData = {};

    if (username) updateData.username = username;
    if (role) updateData.role = role;
    if (password && password.length > 0) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    return NextResponse.json({ success: true, admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update admin" },
      { status: 500 }
    );
  }
}
