import { NextRequest, NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { hashApiKey } from "@/lib/apiKeys"

export type ApiKeyRecord = {
  id: string
  applicationId: string
  enabled: boolean
  prefix: string
  lastFour: string
}

export function withApiKey<TCtx = unknown>(
  handler: (req: NextRequest, ctx: TCtx, apiKey: ApiKeyRecord) => Promise<Response>
) {
  return async (req: NextRequest, ctx: TCtx) => {
    const apiKeyHeader = req.headers.get("x-api-key") || req.headers.get("X-Api-Key")
    if (!apiKeyHeader) {
      return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 })
    }

    const keyHash = hashApiKey(apiKeyHeader)
    const key = await prisma.apiKey.findFirst({
      where: { keyHash, enabled: true },
      select: { id: true, applicationId: true, enabled: true, prefix: true, lastFour: true },
    })

    if (!key) {
      return NextResponse.json({ error: "Invalid API key" }, { status: 401 })
    }

    return handler(req, ctx, key)
  }
}
