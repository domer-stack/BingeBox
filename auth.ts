import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        login: { label: "Username or email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const login = credentials?.login as string | undefined;
        const password = credentials?.password as string | undefined;
        if (!login?.trim() || !password) return null;

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ username: login.trim() }, { email: login.trim().toLowerCase() }],
          },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return null;

        return {
          id: user.id,
          name: user.displayName ?? user.username,
          email: user.email,
          username: user.username,
          avatarId: user.avatarId,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.username = (user as { username?: string }).username;
        token.avatarId = (user as { avatarId?: string }).avatarId;
      }
      if (trigger === "update" && session) {
        const patch = session as { avatarId?: string; name?: string };
        if (patch.avatarId) token.avatarId = patch.avatarId;
        if (patch.name) token.name = patch.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.username = token.username as string;
        session.user.avatarId = token.avatarId as string | undefined;
      }
      return session;
    },
  },
});
