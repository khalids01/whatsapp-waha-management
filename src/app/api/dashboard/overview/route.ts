import { NextResponse } from "next/server"
import { withAuth } from "@/lib/withAuth"
import * as svc from "@/features/sessions/services"
import type { WahaSessionRaw } from "@/features/sessions/schemas"

export const GET = withAuth(async () => {
  try {
    const sessions = (await svc.listSessions()) as WahaSessionRaw[]
    const total = sessions.length
    const active = sessions.filter((s) => {
      const state = String(s.state ?? s.status ?? "")
      return !/(stop|stopped|close|closed|idle|inactive)/i.test(state)
    }).length

    return NextResponse.json({ sessions: { total, active } })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
})
