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
// ---------------------------
// PATCH  (Update product)
// ---------------------------
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();

    const {
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
      offer_end_date,
    } = body;

    const fields: string[] = [];
    const values: (string | number | boolean | null | string[])[] = [];
    let idx = 1;

    const addField = (column: string, value: string | number | boolean | null | string[], cast?: string) => {
      fields.push(`${column} = $${idx}` + (cast ? `::${cast}` : ""));
      values.push(value);
      idx++;
    };

    if (store_id !== undefined) addField("store_id", store_id);
    if (name !== undefined) addField("name", name);
    if (price !== undefined) addField("price", price);
    if (discounted_price !== undefined) addField("discounted_price", discounted_price);
    if (product_status !== undefined) addField("product_status", product_status);
    if (item_id !== undefined) addField("item_id", item_id);
    if (image !== undefined) addField("image", image);
    if (sku !== undefined) addField("sku", sku);
    if (brands !== undefined) addField("brands", brands, "text[]");
    if (weight !== undefined) addField("weight", weight, "text[]");
    if (image_thumbnails !== undefined) addField("image_thumbnails", image_thumbnails, "text[]");

    // compare_key normalization
    if (compare_key !== undefined) {
      const normalized =
        Array.isArray(compare_key)
          ? compare_key.join(", ").toLowerCase()
          : compare_key
          ? compare_key.toLowerCase()
          : null;

      addField("compare_key", normalized);
    }

    if (category !== undefined) addField("category", category);
    if (subcategory !== undefined) addField("subcategory", subcategory);
    if (maincategory !== undefined) addField("maincategory", maincategory);
    if (short_description !== undefined) addField("short_description", short_description);
    if (long_description !== undefined) addField("long_description", long_description);

    // Date conversion
    if (offer_start_date !== undefined) {
      addField(
        "offer_start_date",
        offer_start_date ? new Date(offer_start_date).toISOString() : null
      );
    }

    if (offer_end_date !== undefined) {
      addField(
        "offer_end_date",
        offer_end_date ? new Date(offer_end_date).toISOString() : null
      );
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields provided for update" },
        { status: 400 }
      );
    }

    values.push(id); // last param for WHERE
    const query = `
      UPDATE flyer_products
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product updated",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("PATCH /flyer-products Error:", err);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}


// ---------------------------
// DELETE (Remove product)
// ---------------------------
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM flyer_products WHERE id = $1 RETURNING *;",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Product deleted",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("DELETE /flyer-products Error:", err);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}
