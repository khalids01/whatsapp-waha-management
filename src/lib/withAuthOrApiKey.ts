import { NextRequest, NextResponse } from "next/server"
import { headers } from "next/headers"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { hashApiKey } from "@/lib/apiKeys"
import type { ApiKeyRecord } from "@/lib/withApiKey"

export type SessionPayload = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

export type AuthOrApiKey =
  | { kind: "session"; session: SessionPayload }
  | { kind: "apiKey"; apiKey: ApiKeyRecord }

export function withAuthOrApiKey<TCtx = unknown>(
  handler: (req: NextRequest, ctx: TCtx, authCtx: AuthOrApiKey) => Promise<Response>
) {
  return async (req: NextRequest, ctx: TCtx) => {
    const hdrs = await headers()
    const session = await auth.api.getSession({ headers: hdrs })
    if (session) {
      return handler(req, ctx, { kind: "session", session })
    }

    // Try API key
    const apiKeyHeader = req.headers.get("x-api-key") || req.headers.get("X-Api-Key")
    if (apiKeyHeader) {
      const keyHash = hashApiKey(apiKeyHeader)
      const key = await prisma.apiKey.findFirst({
        where: { keyHash, enabled: true },
        select: { id: true, applicationId: true, enabled: true, prefix: true, lastFour: true },
      })
      if (key) {
        return handler(req, ctx, { kind: "apiKey", apiKey: key as ApiKeyRecord })
      }
    }

    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }
}
