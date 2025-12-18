import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    // Simple DB call
    const result = await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      message: "Prisma connected successfully 🚀",
      result,
    });
  } catch (error: unknown) {
    console.error("Prisma connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Prisma failed to connect ❌",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
