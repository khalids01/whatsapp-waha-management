import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "@/lib/prisma"
import { appConfig } from "@/appConfig"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: true },

  advanced: {
    cookies: {
      session_token: {
        name: appConfig.sessionTokenName
      }
    }
  },
  session:{
    expiresIn: 3600 * 24 * 30,
    updateAge: 3600 * 24 * 7,
  }
})

export type { Session, User } from "better-auth"
