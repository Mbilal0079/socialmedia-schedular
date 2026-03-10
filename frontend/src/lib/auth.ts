import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";

// Build providers list dynamically based on available env vars
const providers: NextAuthOptions["providers"] = [];

// Only add Google if credentials are configured
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
}

// Only add GitHub if credentials are configured
if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) {
  providers.push(
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    })
  );
}

// Demo credentials provider - always available
providers.push(
  CredentialsProvider({
    name: "Demo Account",
    credentials: {
      email: { label: "Email", type: "email", placeholder: "demo@example.com" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      try {
        if (!credentials?.email) return null;

        // Auto-create or find user in database
        const user = await prisma.user.upsert({
          where: { email: credentials.email },
          update: {},
          create: {
            email: credentials.email,
            name: credentials.email.split("@")[0],
          },
        });

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
        };
      } catch (error) {
        console.error("Auth error:", error);
        // Throw with actual message so the user sees what's wrong
        throw new Error(
          error instanceof Error ? error.message : "Database connection failed"
        );
      }
    },
  })
);

export const authOptions: NextAuthOptions = {
  // NOTE: No PrismaAdapter - it conflicts with CredentialsProvider + JWT strategy.
  // The adapter tries to create database sessions, but JWT strategy uses cookies.
  // Without the adapter, we handle user creation manually in authorize().
  providers,
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.sub = user.id;
      }
      return token;
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
