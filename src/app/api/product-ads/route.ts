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
