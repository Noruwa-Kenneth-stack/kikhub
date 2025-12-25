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

type OpeningHour = {
  day: string;
  open: string;
  close: string;
};

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // <<------ FIXED

    if (!id) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const body = await req.json();
    const {
      store_name,
      image_url,
      status,
      featured,
      logo,
      city,
      address,
      categories,
      location,
      opening_hours,
    } = body;

    // Convert opening hours array to formatted string
    const openingHoursString = Array.isArray(opening_hours)
      ? (opening_hours as OpeningHour[])
          .map((h) => `${h.day}: ${h.open} – ${h.close}`)
          .join("\n")
      : opening_hours;

    const fields: string[] = [];
    const values: (string | number | boolean | null)[] = [];
    let idx = 1;

    if (store_name !== undefined) {
      fields.push(`store_name = $${idx++}`);
      values.push(store_name);
    }
    if (image_url !== undefined) {
      fields.push(`image_url = $${idx++}`);
      values.push(image_url);
    }
    if (status !== undefined) {
      fields.push(`status = $${idx++}`);
      values.push(status);
    }
    if (featured !== undefined) {
      fields.push(`featured = $${idx++}`);
      values.push(featured);
    }
    if (logo !== undefined) {
      fields.push(`logo = $${idx++}`);
      values.push(logo);
    }
    if (city !== undefined) {
      fields.push(`city = $${idx++}`);
      values.push(city);
    }
    if (address !== undefined) {
      fields.push(`address = $${idx++}`);
      values.push(address);
    }
    if (categories !== undefined) {
      fields.push(`categories = $${idx++}::text[]`);
      values.push(categories);
    }
    if (opening_hours !== undefined) {
      fields.push(`opening_hours = $${idx++}`);
      values.push(openingHoursString);
    }

    // Handle PostGIS POINT update
    if (
      location &&
      location.lat !== null &&
      location.lng !== null &&
      location.lat !== undefined &&
      location.lng !== undefined
    ) {
      fields.push(
        `location = ST_GeomFromText('POINT(${location.lng} ${location.lat})', 4326)`
      );
    }

    if (fields.length === 0) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    values.push(id);
    const query = `
      UPDATE stores
      SET ${fields.join(", ")}
      WHERE id = $${idx}
      RETURNING *;
    `;

    const result = await pool.query(query, values);

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: result.rows[0] });
  } catch (err) {
    console.error("Update Error:", err);
    return NextResponse.json(
      { error: "Failed to update store" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params; // <<-- IMPORTANT
    if (!id) {
      return NextResponse.json(
        { error: "Store ID is required" },
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM stores WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json(
        { error: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Store deleted",
      data: result.rows[0],
    });
  } catch (err) {
    console.error("DELETE Error:", err);
    return NextResponse.json(
      { error: "Failed to delete store" },
      { status: 500 }
    );
  }
}
