// /app/api/product-ads-edit/route.ts
import { NextRequest, NextResponse } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.FLYERS_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}); 

export async function GET(req: NextRequest) {
  try {
    const { search = "", page = "1", limit = "20" } = Object.fromEntries(req.nextUrl.searchParams);

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);
    const offset = (pageNum - 1) * limitNum;

    // Total rows for pagination
    const countResult = await pool.query(
      `SELECT COUNT(*) FROM product_ads WHERE title ILIKE $1`,
      [`%${search}%`]
    );
    const totalCount = parseInt(countResult.rows[0].count);
    const totalPages = Math.ceil(totalCount / limitNum) || 1;

    // Fetch paginated data
    const result = await pool.query(
      `SELECT * FROM product_ads WHERE title ILIKE $1 ORDER BY id ASC LIMIT $2 OFFSET $3`,
      [`%${search}%`, limitNum, offset]
    );

    return NextResponse.json({ data: result.rows, totalPages });
  } catch (err) {
    console.error("GET /product-ads-edit error:", err);
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
