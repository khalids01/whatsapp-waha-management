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
  }
})

export type { Session, User } from "better-auth"
