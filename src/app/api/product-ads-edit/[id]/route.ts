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

// ---------------- PATCH ----------------
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const storeId = Number(id);

    if (!Number.isInteger(storeId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const body = await req.json();

    const allowedColumns = [
      "title",
      "description",
      "city",
      "src",
      "alt",
      "status",
      "featured",
      "image",
    ];

    const keys = Object.keys(body).filter(
      (k) =>
        allowedColumns.includes(k) &&
        body[k] !== undefined &&
        body[k] !== null &&
        body[k] !== ""
    );

    if (keys.length === 0) {
      return NextResponse.json({ success: true });
    }

    const values = keys.map((k) => body[k]);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

    const query = `
      UPDATE store_ads
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    const result = await pool.query(query, [...values, storeId]);

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("[PATCH store_ads] Error:", err);
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}



// ---------------- DELETE ----------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const storeId = Number(id);

    if (!Number.isInteger(storeId)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM store_ads WHERE id = $1 RETURNING *",
      [storeId]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("[DELETE store_ads] Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}

