import { NextResponse, NextRequest } from "next/server";
import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  database: process.env.POSTGRES_DB,
});

// ---------------- PATCH ----------------
export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("[PATCH product_banner] ID:", id);

    const body = await req.json();
    console.log("[PATCH product_banner] Body:", body);

    // Filter out empty/undefined/null fields AND updated_at
    const keys = Object.keys(body).filter(
      (k) =>
        k !== "updated_at" &&
        body[k] !== undefined &&
        body[k] !== null &&
        (typeof body[k] !== "object" || Object.keys(body[k]).length > 0)
    );

    console.log("[PATCH product_banner] Valid keys to update:", keys);

    if (keys.length === 0) {
      console.log("[PATCH product_banner] No valid fields to update");
      return NextResponse.json({ success: true });
    }

    const values = keys.map((k) => body[k]);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

    const query = `
      UPDATE product_banner
      SET ${setClause}, updated_at = NOW()
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    console.log("[PATCH product_banner] Query:", query);
    console.log("[PATCH product_banner] Values:", [...values, id]);

    const result = await pool.query(query, [...values, id]);
    console.log("[PATCH product_banner] Result rows:", result.rows);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("[PATCH product_banner] Error:", err);
    return NextResponse.json(
      { error: "Update failed", details: String(err) },
      { status: 500 }
    );
  }
}

// ---------------- DELETE ----------------
export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    console.log("[DELETE product_banner] ID:", id);

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM product_banner WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[DELETE product_banner] Deleted:", result.rows[0]);
    return NextResponse.json({ message: "Deleted", data: result.rows[0] });
  } catch (err) {
    console.error("[DELETE product_banner] Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
