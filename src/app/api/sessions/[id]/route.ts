import { NextResponse } from "next/server"
import * as svc from "@/features/sessions/services"
import type { WahaSessionRaw } from "@/features/sessions/schemas"

export async function DELETE(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const sessions = (await svc.listSessions()) as WahaSessionRaw[]
    const target = sessions.find((s) => (s.id ?? s.name) === id)
    if (target) {
      const state = String(target.state ?? target.status ?? "")
      const isActive = !/(stop|stopped|close|closed|idle|inactive)/i.test(state)
      if (isActive) {
        return NextResponse.json(
          { error: "Stop the session before deleting." },
          { status: 400 }
        )
      }
    }
    const data = await svc.deleteSession(id)
    return NextResponse.json(data)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
