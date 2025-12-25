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
    const { name, language, icon } = await req.json();

    const query = `
      INSERT INTO itemlist (name, language, icon)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [name, language, icon || null];

    const result = await pool.query(query, values);
    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Failed to insert item" }, { status: 500 });
  }
}
