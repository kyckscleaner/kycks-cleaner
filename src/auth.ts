import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "@/auth.config";
import { verifyLoginCode } from "@/lib/emailOtp";

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
        code: { label: "Code", type: "text" },
      },
      authorize: async (credentials) => {
        const email = (credentials?.email as string | undefined)?.trim().toLowerCase();
        const password = (credentials?.password as string | undefined)?.trim();
        const code = (credentials?.code as string | undefined)?.trim();
        if (!email || !password || !code) return null;

        const user = await prisma.adminUser.findUnique({ where: { email } });
        if (!user) return null;

        const validPassword = await bcrypt.compare(password, user.passwordHash);
        if (!validPassword) return null;

        const validCode = await verifyLoginCode(email, code);
        if (!validCode) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
});
