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
interface ColumnInfo {
  column_name: string;
}

// ---------------- PATCH ----------------
// Fetch table columns once (cached)
let storeAdsColumns: string[] | null = null;

async function getStoreAdsColumns() {
  if (storeAdsColumns) return storeAdsColumns;

  const res = await pool.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'store_ads';
  `);

  storeAdsColumns = res.rows.map((r: ColumnInfo) => r.column_name);
  console.log("[store_ads] Columns:", storeAdsColumns);
  return storeAdsColumns;
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const body = await req.json();
    const columns = await getStoreAdsColumns();

    console.log("[PATCH store_ads] Incoming body:", body);

    // Filter fields: must exist in table + not null/empty
    const keys = Object.keys(body).filter(
      (k) =>
        columns.includes(k) && // must exist in db
        body[k] !== null &&
        body[k] !== undefined &&
        body[k] !== ""
    );

    console.log("[PATCH store_ads] Valid keys:", keys);

    if (keys.length === 0) {
      return NextResponse.json({ success: true, message: "Nothing to update" });
    }

    const values = keys.map((k) => body[k]);
    let setClause = keys.map((k, i) => `${k} = $${i + 1}`).join(", ");

    // If updated_at column exists → append it
    if (columns.includes("updated_at")) {
      setClause += `, updated_at = NOW()`;
    }

    const query = `
      UPDATE store_ads
      SET ${setClause}
      WHERE id = $${keys.length + 1}
      RETURNING *;
    `;

    console.log("[PATCH store_ads] Query:", query);
    console.log("[PATCH store_ads] Values:", [...values, id]);

    const result = await pool.query(query, [...values, id]);

    console.log("[PATCH store_ads] Updated row:", result.rows[0]);

    return NextResponse.json({ success: true, data: result.rows[0] });
  } catch (err) {
    console.error("[PATCH store_ads] Error:", err);
    return NextResponse.json(
      { error: "PATCH failed", details: String(err) },
      { status: 500 }
    );
  }
}

// ---------------- DELETE ----------------
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> } // <-- await this
) {
  try {
    const { id } = await context.params;
    console.log("[DELETE store_ads] ID:", id);

    if (!id) {
      return NextResponse.json({ error: "ID required" }, { status: 400 });
    }

    const result = await pool.query(
      "DELETE FROM store_ads WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    console.log("[DELETE store_ads] Deleted:", result.rows[0]);
    return NextResponse.json({ message: "Deleted", data: result.rows[0] });
  } catch (err) {
    console.error("[DELETE store_ads] Error:", err);
    return NextResponse.json({ error: "Delete failed" }, { status: 500 });
  }
}
