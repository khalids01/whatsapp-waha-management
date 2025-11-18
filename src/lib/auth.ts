import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import prisma from "@/lib/prisma"
import { appConfig } from "@/appConfig"
import { magicLink } from "better-auth/plugins/magic-link"
import { env } from "@/env"
import { sendMagicLinkEmail } from "@/features/email/lib"

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: { enabled: false },

  advanced: {
    cookies: {
      session_token: {
        name: appConfig.sessionTokenName
      }
    }
  },
  session: {
    expiresIn: 3600 * 24 * 30,
    updateAge: 3600 * 24 * 7,
  },
  plugins: [
    magicLink({
      sendMagicLink: async ({ email, url, token }) => {
        // Better Auth generates an absolute URL based on the incoming request.
        // When running behind a reverse proxy or non-standard port, this can default to localhost.
        // To ensure users receive a link with the correct public origin, rewrite the origin
        // using NEXT_PUBLIC_APP_URL if provided.
        try {
          const appUrl = "/api/auth";
          let finalUrl = url;
          if (appUrl) {
            try {
              const targetOrigin = new URL(appUrl);
              const u = new URL(url);
              // Replace origin and explicitly drop any port to avoid leaking proxy port
              u.protocol = targetOrigin.protocol;
              u.hostname = targetOrigin.hostname;
              // If NEXT_PUBLIC_APP_URL has no port, this clears any port coming from the proxy
              u.port = targetOrigin.port || "";
              finalUrl = u.toString();
            } catch {
              // If URL parsing fails for any reason, fall back to the original url
            }
          }
          await sendMagicLinkEmail(email, finalUrl);
        } catch (e) {
          // Re-throw to let Better Auth propagate the error upstream
          throw e;
        }
      },
      // When signup is disabled, Better Auth will only allow magic link sign-in for existing users
      disableSignUp: !!env.DISABLE_SIGNUP && env.DISABLE_SIGNUP == "true" ? true : false,
      
    }),
  ],
})

export type { Session, User } from "better-auth"
