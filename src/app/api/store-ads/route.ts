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
      title,
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
