import { NextRequest, NextResponse } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

// const pool = new Pool({
//   user: process.env.POSTGRES_USER,
//   password: process.env.POSTGRES_PASSWORD,
//   host: process.env.POSTGRES_HOST,
//   port: Number(process.env.POSTGRES_PORT) || 5432,
//   database: process.env.POSTGRES_DB,
// });

export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.FLYERS_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}); 

// GET with pagination + search
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Count total items
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM product_banner WHERE title ILIKE $1`,
      [`%${search}%`]
    );
    const total = parseInt(countRes.rows[0].count, 10);

    // Get paginated items
    const res = await pool.query(
      `SELECT * FROM product_banner
       WHERE title ILIKE $1
       ORDER BY id ASC
       LIMIT $2 OFFSET $3`,
      [`%${search}%`, limit, offset]
    );

    return NextResponse.json({ items: res.rows, total });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to fetch banners" }, { status: 500 });
  }
}

// POST new banner
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { product_id, title, subtitle, headline, image, city } = body;

    const res = await pool.query(
      `INSERT INTO product_banner (product_id, title, subtitle, headline, image, city)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [product_id || null, title, subtitle || null, headline || null, image || null, city || null]
    );

    return NextResponse.json({ data: res.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to insert banner" }, { status: 500 });
  }
}
