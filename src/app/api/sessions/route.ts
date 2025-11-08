import { NextResponse } from "next/server"
import { CreateSessionBodySchema, type WahaSessionRaw } from "@/features/sessions/schemas"
import * as svc from "@/features/sessions/services"
import { withAuth } from "@/lib/withAuth"

export const GET = withAuth(async () => {
  try {
    const data = (await svc.listSessions()) as WahaSessionRaw[]
    const normalized = data.map((s) => ({ id: s.id ?? s.name ?? "", state: s.state ?? s.status ?? "" }))
    return NextResponse.json(normalized)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
})

export const POST = withAuth(async (req) => {
  try {
    const json = await req.json()
    const parsed = CreateSessionBodySchema.parse(json)
    const data = (await svc.createSession(parsed)) as WahaSessionRaw
    const normalized = { id: data.id ?? data.name ?? "", state: data.state ?? data.status ?? "" }
    return NextResponse.json(normalized, { status: 201 })
  } catch (e: unknown) {
    const isZod = typeof e === "object" && e !== null && (e as { name?: string }).name === "ZodError"
    const message = e instanceof Error ? e.message : "Unexpected error"
    const code = isZod ? 400 : 500
    return NextResponse.json({ error: message }, { status: code })
  }
})
