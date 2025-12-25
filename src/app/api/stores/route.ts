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
    const {
     store_name, image_url, status, featured, logo,
      city, address, categories, location, opening_hours
    } = body;

   const query = `
  INSERT INTO stores
  (store_name, image_url, status, featured, logo, city, address, categories, location, opening_hours)
  VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
  RETURNING *;
`;

const values = [
  store_name, image_url || null, status || null, featured,
  logo || null, city, address, categories, location || null, opening_hours || null
];

    const result = await pool.query(query, values);
    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    console.error("Insert Error:", err);
    return NextResponse.json({ error: "Failed to insert store" }, { status: 500 });
  }
}
