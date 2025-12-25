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

    const { image, title, subtitle, price, offer, hotkey, city } = body;

    const query = `
      INSERT INTO product_ads 
      (image, title, subtitle, price, offer, hotkey, city)
      VALUES ($1, $2, $3, $4, $5, $6, $7)
      RETURNING *;
    `;

    const values = [
      image || null,
      title,
      subtitle || null,
      price || null,
      offer || null,
      hotkey || null,
      city || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ data: result.rows[0] });
  } catch (error: Error | unknown) {
    console.error("FULL ERROR:", error instanceof Error ? error.message : String(error));

    return NextResponse.json(
      { error: "Failed to create product ad" },
      { status: 500 }
    );
  }
}
