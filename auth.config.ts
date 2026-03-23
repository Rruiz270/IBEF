import type { NextAuthConfig } from "next-auth";

// Edge-compatible config — no DB or bcrypt imports
export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/login",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.role = (user as { role?: string }).role;
        token.departmentId = (user as { departmentId?: string | null }).departmentId;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.role = token.role as string | undefined;
        session.user.departmentId = token.departmentId as string | null | undefined;
        session.user.id = token.sub ?? "";
      }
      return session;
    },
    authorized({ auth }) {
      return !!auth;
    },
  },
  providers: [], // filled in auth.ts
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  trustHost: true,
};
