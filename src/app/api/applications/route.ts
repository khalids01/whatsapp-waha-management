import { NextResponse } from "next/server"
import { z } from "zod"
import prisma from "@/lib/prisma"
import { slugify } from "@/lib/slug"
import { withAuth } from "@/lib/withAuth"

const CreateAppSchema = z.object({ name: z.string().min(2).max(100) })

export const GET = withAuth(async (_req, _ctx, session) => {
  const apps = await prisma.application.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, slug: true, createdAt: true, updatedAt: true },
  })
  return NextResponse.json(apps)
})

export const POST = withAuth(async (req, _ctx, session) => {
  try {
    const json = await req.json().catch(() => null)
    if (!json) return NextResponse.json({ error: "Invalid JSON" }, { status: 400 })
    const parsed = CreateAppSchema.safeParse(json)
    if (!parsed.success) return NextResponse.json({ error: parsed.error.message }, { status: 400 })

    const name = parsed.data.name
    const base = slugify(name)

    // ensure slug uniqueness per user, add numeric suffix if needed
    let slug = base
    let i = 1
    while (true) {
      const exists = await prisma.application.findFirst({ where: { userId: session.user.id, slug } })
      if (!exists) break
      i += 1
      slug = `${base}-${i}`
    }

    const app = await prisma.application.create({ data: { userId: session.user.id, name, slug } })
    return NextResponse.json({ id: app.id, name: app.name, slug: app.slug }, { status: 201 })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
})
