import { Pool } from "pg";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function update() {
  await pool.query(
    `UPDATE users SET role = 'tecnologia', department_id = 'tecnologia' WHERE email = 'bruno.almeida@i10.org.br'`
  );
  await pool.query(
    `UPDATE users SET role = 'relacoes_publicas', department_id = 'relacoes_publicas' WHERE email = 'bruno.quick@i10.org.br'`
  );
  // Make sure raphael is the only admin
  await pool.query(
    `UPDATE users SET role = 'admin', department_id = NULL WHERE email = 'raphael@i10.org.br'`
  );
  console.log("Roles updated successfully");
  await pool.end();
}

update().catch((err) => {
  console.error("Failed to update roles:", err);
  process.exit(1);
});
