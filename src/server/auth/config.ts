import { DrizzleAdapter } from "@auth/drizzle-adapter";
import type { DefaultSession, NextAuthConfig } from "next-auth";
import { type DefaultJWT } from "next-auth/jwt";
import type { Provider } from "next-auth/providers";
import CredentialsProvider from "next-auth/providers/credentials";
import DiscordProvider from "next-auth/providers/discord";

import type { UserRole } from "@/@types/db";
import { LoginSchema } from "@/models/forms";
import { db } from "@/server/db";
import {
  accounts,
  sessions,
  users,
  verificationTokens,
} from "@/server/db/schema";
import { verifyPassword } from "./utils/password";
import { getUserById } from "./utils/user";

declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: UserRole;
      username: string;
    } & DefaultSession["user"];
  }

  interface User {
    role?: UserRole | null;
    username?: string | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    role?: UserRole | null;
    username?: string | null;
    id?: string | null;
  }
}

const providers: Provider[] = [
  DiscordProvider,
  CredentialsProvider({
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials, req) {
      try {
        const parsed = await LoginSchema.parseAsync(credentials);
        const { email, password } = parsed;

        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // Find user by email or username
        const user = await db.query.users.findFirst({
          where: (users, { or, eq }) =>
            or(eq(users.email, email), eq(users.username, email)),
        });

        if (!user || !user.password) {
          return null;
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password);

        if (!isValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      } catch (error) {
        console.error(error);
        return null;
      }
    },
  }),
];

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === "function") {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== "credentials");

export const authConfig = {
  providers,
  pages: {
    signIn: "/auth/sign-in",
  },
  adapter: DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  }),
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      token.role = existingUser.role;
      token.username = existingUser.username;
      token.id = existingUser.id;
      token.name = existingUser.name;
      token.email = existingUser.email;

      return token;
    },
    session: ({ session, token }) => {
      if (session.user && token.sub) {
        session.user.id = token.sub;
        session.user.role = token.role ?? session.user.role;
        session.user.username = token.username ?? session.user.username;
      }

      return session;
    },
  },
} satisfies NextAuthConfig;
