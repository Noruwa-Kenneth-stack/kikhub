import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";

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
    const { product_id, title, subtitle, headline, image, city } = body;

    // Validate product_id strictly
    const parsedProductId =
      product_id !== undefined && product_id !== null
        ? Number(product_id)
        : null;

    if (parsedProductId !== null && (!Number.isInteger(parsedProductId) || parsedProductId < 1)) {
      return NextResponse.json(
        { error: "product_id must be a positive integer" },
        { status: 400 }
      );
    }

    const query = `
      INSERT INTO product_banner
        (product_id, title, subtitle, headline, image, city)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `;

    const values = [
      parsedProductId,
      title,
      subtitle || null,
      headline || null,
      image || null,
      city || null,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    console.error("[POST product_banner] Error:", err);
    return NextResponse.json(
      { error: "Failed to insert product banner" },
      { status: 500 }
    );
  }
}
