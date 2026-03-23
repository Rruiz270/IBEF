import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { authConfig } from "./auth.config";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const result = await pool.query(
            "SELECT id, email, name, role, department_id, password_hash FROM users WHERE email = $1 AND active = TRUE",
            [credentials.email]
          );

          const user = result.rows[0];
          if (!user) return null;

          const valid = await bcrypt.compare(
            credentials.password as string,
            user.password_hash
          );
          if (!valid) return null;

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            departmentId: user.department_id,
          };
        } catch (err) {
          console.error("Auth DB error:", err);
          return null;
        }
      },
    }),
  ],
});
