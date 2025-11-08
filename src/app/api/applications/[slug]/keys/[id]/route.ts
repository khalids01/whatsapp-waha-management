import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { z } from "zod"
import { withAuth } from "@/lib/withAuth"

const PatchSchema = z.object({ enabled: z.boolean() })

export const PATCH = withAuth(async (req, ctx: { params: Promise<{ slug: string; id: string }> }, session) => {
  try {
    const { slug, id } = await ctx.params

    const json = await req.json().catch(() => null)
    if (!json) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    const parsed = PatchSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const app = await prisma.application.findFirst({ where: { userId: session.user.id, slug } })
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const updated = await prisma.apiKey.update({
      where: { id },
      data: { enabled: parsed.data.enabled },
      select: { id: true, prefix: true, lastFour: true, enabled: true, createdAt: true },
    })

    if (!updated) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json(updated)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
})

export const DELETE = withAuth(async (_req, ctx: { params: Promise<{ slug: string; id: string }> }, session) => {
  try {
    const { slug, id } = await ctx.params

    const app = await prisma.application.findFirst({ where: { userId: session.user.id, slug } })
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.apiKey.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
})
