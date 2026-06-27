import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email", autocomplete: "email" },
        password: { label: "Password", type: "password", autocomplete: "current-password" },
      },
      authorize: async (credentials) => {
        const emailRaw = credentials?.email as string | undefined;
        const passwordRaw = credentials?.password as string | undefined;

        if (!emailRaw || !passwordRaw) {
          return null;
        }

        const email = emailRaw.toLowerCase().trim();

        try {
          const user = await prisma.adminUser.findUnique({ where: { email } });

          if (!user || !user.isActive) {
            return null;
          }

          const valid = await compare(passwordRaw, user.passwordHash);
          if (!valid) {
            return null;
          }

          await prisma.adminUser.update({
            where: { id: user.id },
            data: { lastLoginAt: new Date() },
          });

          return {
            id: String(user.id),
            name: user.name,
            email: user.email,
            role: user.role,
          };
        } catch {
          console.error("[auth] Database error during authorize");
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  trustHost: true,
});
