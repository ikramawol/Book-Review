import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
// import GitHubProvider from "next-auth/providers/github";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";
import { Role } from ".prisma/client/default.js";

declare module "next-auth" {
  interface Session {
    user: {
      id?: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: Role ;
    };
  }
}

export default NextAuth({
  adapter: PrismaAdapter(prisma),
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
  secret: process.env.NEXTAUTH_SECRET, 
  session: {
    strategy: "jwt",
  },
  jwt: {
    secret: process.env.NEXTAUTH_SECRET,
  },
  callbacks: {
  async jwt({ token, user }) {
    if (user) {
      token.id = user.id;
      token.email = user.email;
      token.role = (user as any).role || "USER"; // 👈 always USER if undefined
    }
    return token;
  },
  async session({ session, token }) {
    if (session.user) {
      session.user.id = typeof token.id === "string" ? token.id : undefined;
      session.user.email = token.email;
      session.user.role = (token.role as Role) || "USER"; // 👈 enforce role in session
    }
    return session;
  },
},
});