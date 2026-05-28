import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";

const adminUsername = process.env.ADMIN_EMAIL || "kyawzawhein";
const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH || "";
const adminPassword = process.env.ADMIN_PASSWORD || "Kzh@dm1n";

async function verifyPassword(password: string) {
  if (adminPasswordHash && await compare(password, adminPasswordHash)) return true;
  return password === adminPassword;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) return null;
        const okUsername = credentials.email === adminUsername;
        const okPassword = await verifyPassword(credentials.password);
        if (!okUsername || !okPassword) return null;
        return { id: "admin", email: adminUsername, name: "Admin" };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.role = "admin";
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.role = token.role;
      return session;
    }
  }
};
