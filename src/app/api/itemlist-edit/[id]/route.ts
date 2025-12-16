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
    console.log("[PATCH itemlist] ID:", id);

    const body = await req.json();
    console.log("[PATCH itemlist] Body:", body);

    // Remove undefined/null/empty fields AND updated_at (even if not used)
    const keys = Object.keys(body).filter(
     (k) =>
    k !== "updated_at" &&
    body[k] !== undefined &&
    body[k] !== null &&
    (typeof body[k] !== "object" || Object.keys(body[k]).length > 0)
    );

    console.log("[PATCH itemlist] Valid keys to update:", keys);

    if (keys.length === 0) {
      console.log("[PATCH itemlist] No valid fields to update");
      return NextResponse.json({ success: true });
    }

    const values = keys.map((k) => body[k]);
    const setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

    const query = `
      UPDATE itemlist
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    console.log("[PATCH itemlist] Query:", query);
    console.log("[PATCH itemlist] Values:", [...values, id]);

    const result = await pool.query(query, [...values, id]);
    console.log("[PATCH itemlist] Result rows:", result.rows);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("[PATCH itemlist] Error:", err);
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
    console.log("[DELETE itemlist] ID:", id);

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM itemlist WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[DELETE itemlist] Deleted:", result.rows[0]);
    return NextResponse.json({ message: "Deleted", data: result.rows[0] });
  } catch (err) {
    console.error("[DELETE itemlist] Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
