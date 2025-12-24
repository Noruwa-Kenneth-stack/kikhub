import { NextRequest, NextResponse } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

interface StoreRow {
  id: number;
  store_name: string;
  image_url: string | null;
  status: string;
  featured: boolean;
  logo: string | null;
  city: string;
  address: string;
  categories: string[] | null;
  lat: number | null;
  lng: number | null;
  opening_hours: string;
}

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

// ---------------- GET: paginated + searchable ----------------
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "10", 10);
    const search = searchParams.get("search") || "";

    const offset = (page - 1) * limit;

    // Count total items matching search
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM stores WHERE store_name ILIKE $1`,
      [`%${search}%`]
    );
    const total = parseInt(countRes.rows[0].count, 10);

    // Get paginated results
    const result = await pool.query(
      `
      SELECT
        id,
        store_name,
        image_url,
        status,
        featured,
        logo,
        city,
        address,
        categories,
        ST_Y(location::geometry) AS lat,
        ST_X(location::geometry) AS lng,
        opening_hours
      FROM stores
      WHERE store_name ILIKE $1
      ORDER BY id ASC
      LIMIT $2 OFFSET $3
      `,
      [`%${search}%`, limit, offset]
    );

    const stores = result.rows.map((row: StoreRow) => ({
      id: row.id,
      store_name: row.store_name,
      image_url: row.image_url || "",
      status: row.status,
      featured: row.featured,
      logo: row.logo || "",
      city: row.city,
      address: row.address,
      categories: row.categories || [],
      location:
        row.lat != null && row.lng != null
          ? { lat: Number(row.lat), lng: Number(row.lng) }
          : null,
      opening_hours: row.opening_hours,
    }));

    return NextResponse.json({ items: stores, total });
  } catch (err) {
    console.error("GET /stores-edit Error:", err);
    return NextResponse.json({ error: "Failed to fetch stores" }, { status: 500 });
  }
}
