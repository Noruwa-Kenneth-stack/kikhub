import { NextRequest, NextResponse } from "next/server";
import pkg from "pg";

export const runtime = "nodejs";

const { Pool } = pkg;

// 👇 singleton pattern
const globalForPg = global as unknown as { pool?: pkg.Pool };

// 👇 singleton pattern
const pool =
  globalForPg.pool ??
  new Pool({
    connectionString: process.env.FLYERS_DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });

if (!globalForPg.pool) globalForPg.pool = pool;

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { src, alt, title, description, city } = body;

    const query = `
      INSERT INTO store_ads
      (src, alt, title, description, city)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *;
    `;

    const values = [
      src || null,
      alt || null,
      title || null,
      description || null,
      city || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    console.error("Error inserting store ad:", err);
    return NextResponse.json(
      { error: "Failed to create store ad" },
      { status: 500 }
    );
  }
}
