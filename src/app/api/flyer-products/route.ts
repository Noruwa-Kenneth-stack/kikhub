import { NextResponse } from "next/server";
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

// POST /api/flyer-products
export async function POST(req: Request) {
  try {
    const body = await req.json();

    const query = `
      INSERT INTO flyer_products (
        store_id, name, price, discounted_price, product_status,
        item_id, image, sku, brands, weight, image_thumbnails,
        compare_key, category, subcategory, short_description,
        long_description, maincategory, offer_start_date, offer_end_date
      )
      VALUES (
        $1, $2, $3, $4, $5,
        $6, $7, $8, $9, $10, $11,
        $12, $13, $14, $15,
        $16, $17, $18, $19
      )
      RETURNING id;
    `;

    const values = [
      body.store_id,
      body.name,
      body.price,
      body.discounted_price,
      body.product_status,
      body.item_id,
      body.image,
      body.sku,
      body.brands,             // ARRAY
      body.weight,             // ARRAY
      body.image_thumbnails,   // ARRAY
      body.compare_key,
      body.category,
      body.subcategory,
      body.short_description,
      body.long_description,
      body.maincategory,
      body.offer_start_date,
      body.offer_end_date,
    ];

    const result = await pool.query(query, values);

    return NextResponse.json({
      success: true,
      id: result.rows[0].id,
    });
  } catch (err: unknown) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { success: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 }
    );
  }
}
