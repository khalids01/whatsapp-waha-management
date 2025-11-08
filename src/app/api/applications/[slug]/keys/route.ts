import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { generateApiKey, hashApiKey } from "@/lib/apiKeys"
import { withAuth } from "@/lib/withAuth"

export const GET = withAuth(async (_req, ctx: { params: Promise<{ slug: string }> }, session) => {
  const { slug } = await ctx.params

  const app = await prisma.application.findFirst({ where: { userId: session.user.id, slug } })
  if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 })

  const keys = await prisma.apiKey.findMany({
    where: { applicationId: app.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, prefix: true, lastFour: true, enabled: true, createdAt: true },
  })
  return NextResponse.json(keys)
})

export const POST = withAuth(async (_req, ctx: { params: Promise<{ slug: string }> }, session) => {
  try {
    const { slug } = await ctx.params

    const app = await prisma.application.findFirst({ where: { userId: session.user.id, slug } })
    if (!app) return NextResponse.json({ error: "Not found" }, { status: 404 })

    const { key, prefix, lastFour } = generateApiKey()
    const keyHash = hashApiKey(key)

    const created = await prisma.apiKey.create({
      data: { applicationId: app.id, keyHash, prefix, lastFour, enabled: true },
      select: { id: true, prefix: true, lastFour: true, enabled: true, createdAt: true },
    })

    // Return plaintext once
    return NextResponse.json({ id: created.id, key, prefix, lastFour, enabled: created.enabled, createdAt: created.createdAt }, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
})
