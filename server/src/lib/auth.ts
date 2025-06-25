import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { PrismaClient } from "../../app/generated/prisma";
import { comparePass, hashPass, mailVerification } from "./functions";

export const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  trustedOrigins: ["http://localhost:5173"],
  emailAndPassword: {
    enabled: true,
    disableSignUp: false,
    requireEmailVerification: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    autoSignIn: true,
    sendResetPassword: async ({ user, url, token }) => {
      // Send reset password email
    },
    resetPasswordTokenExpiresIn: 3600, // 1 hour
    password: {
      hash: async (password) => {
        const hashedPassword = await hashPass({ password });
        return hashedPassword;
      },
      verify: async ({ hash, password }) => {
        const isValid = await comparePass({ hash, password });
        return isValid;
      },
    },
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }) => {
      await mailVerification({ user, url, token });
    },
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    expiresIn: 1800, // 1800 segundos = 30 minutos
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "student",
      },
    },
  },
});
