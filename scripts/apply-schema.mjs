import "dotenv/config";
import fs from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const { Client } = pg;

const DB_URL = process.env.SUPABASE_DB_URL;
if (!DB_URL) throw new Error("Missing SUPABASE_DB_URL");

const schemaPath = path.join(process.cwd(), "supabase", "schema.sql");
const sql = await fs.readFile(schemaPath, "utf8");

const client = new Client({ connectionString: DB_URL, ssl: { rejectUnauthorized: false } });
await client.connect();

try {
  await client.query(sql);
  console.log("Schema applied successfully.");
} finally {
  await client.end();
}

