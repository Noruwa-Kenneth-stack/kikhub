import { NextResponse } from "next/server";
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

// GET — Paginated store ads
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 20);
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    const where = search
      ? `WHERE title ILIKE $1 OR description ILIKE $1 OR city ILIKE $1`
      : "";

    const values = search ? [`%${search}%`] : [];

    const query = `
      SELECT *
      FROM store_ads
      ${where}
      ORDER BY id ASC
      LIMIT ${limit} OFFSET ${offset};
    `;

    const rows = await pool.query(query, values);

    const totalQuery = `
      SELECT COUNT(*) AS count
      FROM store_ads
      ${where};
    `;
    const totalRes = await pool.query(totalQuery, values);
    const total = Number(totalRes.rows[0].count);

    return NextResponse.json({
      data: rows.rows,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error("GET /store-ads error:", err);
    return NextResponse.json({ error: "Failed to load ads" }, { status: 500 });
  }
}

// POST — Create new ad
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { src, alt, title, description, city } = body;

    const result = await pool.query(
      `INSERT INTO store_ads (src, alt, title, description, city)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [src || "", alt || "", title, description || "", city || ""]
    );

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (err) {
    console.error("POST /store-ads error:", err);
    return NextResponse.json({ error: "Failed to create ad" }, { status: 500 });
  }
}
