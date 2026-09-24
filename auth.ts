import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";
import type { Provider } from "next-auth/providers";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

async function ensureUsername(userId: string, email: string | null | undefined, name: string | null | undefined) {
  const existing = await prisma.user.findUnique({ where: { id: userId } });
  if (!existing) return undefined;
  if (existing.username) return existing.username;

  const raw = (email?.split("@")[0] ?? name ?? "viewer").replace(/\W/g, "").toLowerCase().slice(0, 20);
  const base = raw.length >= 3 ? raw : "viewer";
  let username = base;
  let n = 0;
  while (await prisma.user.findFirst({ where: { username } })) {
    username = `${base}${++n}`;
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      username,
      displayName: existing.displayName ?? name ?? username,
    },
  });
  return username;
}

function oauthUsername(base: string, suffix: string) {
  const clean = base.replace(/\W/g, "").toLowerCase().slice(0, 18) || "viewer";
  return `${clean}${suffix}`.slice(0, 24);
}

const oauthProviders: Provider[] = [];

if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  oauthProviders.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
      profile(profile) {
        const suffix = profile.sub?.slice(-6) ?? "google";
        return {
          name: profile.name,
          email: profile.email,
          image: profile.picture,
          username: oauthUsername(profile.email?.split("@")[0] ?? "user", suffix),
          displayName: profile.name,
        };
      },
    })
  );
}

if (process.env.AUTH_GITHUB_ID && process.env.AUTH_GITHUB_SECRET) {
  oauthProviders.push(
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
      profile(profile) {
        return {
          name: profile.name ?? profile.login,
          email: profile.email,
          image: profile.avatar_url,
          username: oauthUsername(profile.login ?? "user", String(profile.id)),
          displayName: profile.name ?? profile.login,
        };
      },
    })
  );
}

const credentialsProvider = Credentials({
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
    if (!user?.password) return null;

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
});

const providers: Provider[] = [...oauthProviders, credentialsProvider];

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers,
  pages: {
    signIn: "/login",
  },
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user?.id) {
        token.id = user.id;
        const username =
          (user as { username?: string }).username ??
          (await ensureUsername(user.id, user.email, user.name));
        token.username = username;
        const dbUser = await prisma.user.findUnique({ where: { id: user.id } });
        token.avatarId = dbUser?.avatarId;
      } else if (token.id && account?.provider && account.provider !== "credentials") {
        const username = await ensureUsername(
          token.id as string,
          token.email as string | undefined,
          token.name as string | undefined
        );
        token.username = username;
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
