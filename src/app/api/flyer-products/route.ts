import {  NextResponse } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

// DB connection
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
});

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
