import { NextResponse } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

interface FlyerProductRow {
  id: number;
  store_id: number;
  name: string;
  price: number | null;
  discounted_price: number | null;
  product_status: string | null;
  item_id: number | null;
  image: string | null;
  sku: string | null;
  brands: string[] | null;
  weight: string[] | null;
  image_thumbnails: string[] | null;
  compare_key: string | null;
  category: string | null;
  subcategory: string | null;
  maincategory: string | null;
  short_description: string | null;
  long_description: string | null;
  offer_start_date: string | null;
  offer_end_date: string | null;
}


export const runtime = "nodejs";

const pool = new Pool({
  connectionString: process.env.FLYERS_DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
}); 

export async function GET(req: Request) {
   try {
    const url = new URL(req.url);
    const page = Number(url.searchParams.get("page") ?? 1);
    const limit = Number(url.searchParams.get("limit") ?? 20);
    const offset = (page - 1) * limit;
    const searchQuery = `%${url.searchParams.get("search") ?? ""}%`;

    const result = await pool.query(`
      SELECT
        id,
        store_id,
        name,
        price,
        discounted_price,
        product_status,
        item_id,
        image,
        sku,
        brands,
        weight,
        image_thumbnails,
        compare_key,
        category,
        subcategory,
        maincategory,
        short_description,
        long_description,
        offer_start_date,
        offer_end_date
      FROM flyer_products
      WHERE name ILIKE $3
      ORDER BY id ASC
      LIMIT $1 OFFSET $2;
    `, [limit, offset, searchQuery]);

    const totalResult = await pool.query(`SELECT COUNT(*) FROM flyer_products WHERE name ILIKE $1;`, [searchQuery]);
    const total = Number(totalResult.rows[0].count);

    const products = result.rows.map((row: FlyerProductRow) => ({
      id: row.id,
      store_id: row.store_id,
      name: row.name,
      price: row.price,
      discounted_price: row.discounted_price,
      product_status: row.product_status,
      item_id: row.item_id,
      image: row.image || "",
      sku: row.sku || "",
      brands: row.brands || [],
      weight: row.weight || [],
      image_thumbnails: row.image_thumbnails || [],
      compare_key: row.compare_key,
      category: row.category,
      subcategory: row.subcategory,
      maincategory: row.maincategory,
      short_description: row.short_description,
      long_description: row.long_description,
      offer_start_date: row.offer_start_date,
      offer_end_date: row.offer_end_date,
    }));

    return NextResponse.json({ items: products, total });
  } catch (err) {
    console.error("GET /flyer-products Error:", err);
    return NextResponse.json(
      { error: "Failed to fetch flyer products" },
      { status: 500 }
    );
  }
}
