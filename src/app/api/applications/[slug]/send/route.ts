import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { hashApiKey } from "@/lib/apiKeys"
import { wahaClient } from "@/lib/wahaClient"

const SendSchema = z.object({
  to: z.string().min(3),
  text: z.string().min(1),
  sessionId: z.string().min(1).default("default"),
  reply_to: z.string().optional(),
  linkPreview: z.boolean().optional(),
  linkPreviewHighQuality: z.boolean().optional(),
})

export async function POST(req: Request, ctx: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await ctx.params
    const apiKeyHeader = req.headers.get("x-api-key") || req.headers.get("X-Api-Key")
    if (!apiKeyHeader) {
      return NextResponse.json({ error: "Missing x-api-key" }, { status: 401 })
    }

    const bodyJson = await req.json().catch(() => null)
    if (!bodyJson) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    const parsed = SendSchema.safeParse(bodyJson)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })
    const { to, text, sessionId, reply_to, linkPreview, linkPreviewHighQuality } = parsed.data

    // Authenticate API key against app slug
    const keyHash = hashApiKey(apiKeyHeader)
    const key = await prisma.apiKey.findFirst({
      where: {
        keyHash,
        enabled: true,
        application: { slug },
      },
      include: { application: true },
    })
    if (!key) return NextResponse.json({ error: "Invalid API key" }, { status: 401 })

    // Call WAHA sendText (wahaClient has baseURL that already ends with /api)
    const payload = {
      chatId: to,
      text,
      session: sessionId,
      ...(reply_to ? { reply_to } : {}),
      ...(typeof linkPreview === "boolean" ? { linkPreview } : {}),
      ...(typeof linkPreviewHighQuality === "boolean" ? { linkPreviewHighQuality } : {}),
    }

    try {
      const res = await wahaClient.post(`/${encodeURIComponent(sessionId)}/sendText`, payload)
      const providerMessageId = (res.data?.id ?? res.data?.messageId ?? null) as string | null

      await prisma.message.create({
        data: {
          applicationId: key.applicationId,
          to,
          text,
          status: "sent",
          providerMessageId,
          sessionId,
        },
      })

      return NextResponse.json({ id: providerMessageId, status: "sent" }, { status: 201 })
    } catch (e: unknown) {
      const err = e as { response?: { data?: { error?: unknown } }; message?: unknown }
      const msg = (err.response?.data?.error as string | undefined) ?? (err.message as string | undefined) ?? "Failed to send"
      await prisma.message.create({
        data: {
          applicationId: key.applicationId,
          to,
          text,
          status: "failed",
          error: String(msg),
          sessionId,
        },
      })
      return NextResponse.json({ error: String(msg) }, { status: 502 })
    }
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
