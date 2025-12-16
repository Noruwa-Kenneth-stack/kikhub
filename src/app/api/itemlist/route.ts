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
