import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ success: true, result });
  } catch (err) {
    console.error("Prisma test error:", err);
    return NextResponse.json({ success: false, error: err }, { status: 500 });
  }
}
