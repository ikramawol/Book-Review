import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export default NextAuth({
  adapter: PrismaAdapter(prisma), // connects NextAuth to Prisma
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    // GitHubProvider({
    //   clientId: process.env.GITHUB_CLIENT_ID!,
    //   clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    // }),

  ],
  secret: process.env.NEXTAUTH_SECRET, // use `openssl rand -base64 32` to generate
  session: {
    strategy: "jwt", // or "database" if you want sessions stored in DB
  },
  callbacks: {
    async session({ session, token, user }) {
      // attach user id to session
      if (session.user) {
        session.user.id = user.id ?? token.sub;
      }
      return session;
    },
  },
});
