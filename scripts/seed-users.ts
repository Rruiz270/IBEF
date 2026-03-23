import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

async function seedUsers() {
  const users = [
    {
      email: "raphael@i10.org.br",
      password: "i10Admin2026!",
      name: "Raphael Ruiz",
      role: "admin",
      department_id: null,
    },
    {
      email: "bruno.almeida@i10.org.br",
      password: "i10Admin2026!",
      name: "Bruno Almeida",
      role: "admin",
      department_id: null,
    },
    {
      email: "bruno.quick@i10.org.br",
      password: "i10Admin2026!",
      name: "Bruno Quick",
      role: "admin",
      department_id: null,
    },
    {
      email: "juridico@i10.org.br",
      password: "i10Juridico2026!",
      name: "Equipe Jurídico",
      role: "juridico",
      department_id: "juridico",
    },
    {
      email: "tecnologia@i10.org.br",
      password: "i10Tech2026!",
      name: "Equipe Tecnologia",
      role: "tecnologia",
      department_id: "tecnologia",
    },
    {
      email: "sc@i10.org.br",
      password: "i10SC2026!",
      name: "Equipe Santa Catarina",
      role: "santa_catarina",
      department_id: "santa_catarina",
    },
    {
      email: "pedagogico@i10.org.br",
      password: "i10Ped2026!",
      name: "Equipe Pedagógico",
      role: "pedagogico",
      department_id: "pedagogico",
    },
    {
      email: "operacoes@i10.org.br",
      password: "i10Ops2026!",
      name: "Equipe Operações",
      role: "operacoes_locais",
      department_id: "operacoes_locais",
    },
    {
      email: "rp@i10.org.br",
      password: "i10RP2026!",
      name: "Equipe Relações Públicas",
      role: "relacoes_publicas",
      department_id: "relacoes_publicas",
    },
    {
      email: "admin.fin@i10.org.br",
      password: "i10AdmFin2026!",
      name: "Equipe Administrativo Financeiro",
      role: "administrativo_financeiro",
      department_id: "administrativo_financeiro",
    },
  ];

  for (const user of users) {
    const hash = await bcrypt.hash(user.password, 12);
    await sql`
      INSERT INTO users (email, password_hash, name, role, department_id)
      VALUES (${user.email}, ${hash}, ${user.name}, ${user.role}, ${user.department_id})
      ON CONFLICT (email) DO NOTHING
    `;
    console.log(`Created user: ${user.email} (${user.role})`);
  }

  console.log("\nCREDENTIALS SUMMARY:");
  users.forEach((u) => console.log(`  ${u.email} : ${u.password}`));
}

seedUsers().catch(console.error);
