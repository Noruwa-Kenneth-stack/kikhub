// pages/api/admin/update.ts
import type { NextApiRequest, NextApiResponse } from "next";
import prisma from "@/lib/prisma"; 
import bcrypt from "bcryptjs";

interface UpdateData {
  username: string;
  role: string;
  passwordHash?: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "PATCH") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    // You should get userId from session/auth middleware
    const userId = req.body.userId;
    const { userName, role, password } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updateData: UpdateData = {
      username: userName,
      role,
    };

    // Hash password if it is provided
    if (password && password.length > 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updateData.passwordHash = hashedPassword;
    }

    const updatedAdmin = await prisma.admin.update({
      where: { id: Number(userId) },
      data: updateData,
    });

    res.status(200).json({ success: true, admin: updatedAdmin });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update admin" });
  }
}
