import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { sql } from "@vercel/postgres";
import bcrypt from "bcryptjs";
import { authConfig } from "./auth.config";

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

        const result = await sql`
          SELECT id, email, name, role, department_id, password_hash
          FROM users
          WHERE email = ${credentials.email as string} AND active = TRUE
        `;

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
      },
    }),
  ],
});
