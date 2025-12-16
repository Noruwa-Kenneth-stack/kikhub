import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import bcrypt from "bcryptjs";

interface UpdateData {
  username: string;
  role: string;
  passwordHash?: string;
}

export async function PATCH(req: Request) {
  try {
    const body = await req.json();
    const { userId, userName, role, password } = body;

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    const updateData: UpdateData = {
      username: userName,
      role,
    };

    if (password && password.length > 0) {
      const saltRounds = 10;
      updateData.passwordHash = await bcrypt.hash(password, saltRounds);
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, admin: updatedAdmin },
      { status: 200 }
    );
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Failed to update admin" },
      { status: 500 }
    );
  }
}
