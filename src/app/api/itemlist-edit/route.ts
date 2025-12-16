import { NextRequest, NextResponse } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
});

// ---------------- GET: paginated + searchable ----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Count total items
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM itemlist WHERE name ILIKE $1`,
      [`%${search}%`]
    );
    const total = parseInt(countRes.rows[0].count, 10);

    // Get paginated items
    const res = await pool.query(
      `SELECT * FROM itemlist
       WHERE name ILIKE $1
       ORDER BY id ASC
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    return NextResponse.json({ items: res.rows, total });
  } catch (err) {
    console.error("[GET itemlist]", err);
    return NextResponse.json({ error: "Failed to fetch items" }, { status: 500 });
  }
}

// ---------------- POST: add new item ----------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, language, icon } = body;

    const res = await pool.query(
      `INSERT INTO itemlist (name, language, icon)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [name, language, icon || null]
    );

    return NextResponse.json({ data: res.rows[0] });
  } catch (err) {
    console.error("[POST itemlist]", err);
    return NextResponse.json({ error: "Failed to insert item" }, { status: 500 });
  }
}