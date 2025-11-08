import { NextResponse } from "next/server"
import * as svc from "@/features/sessions/services"
import { withAuth } from "@/lib/withAuth"

export const POST = withAuth(async (_req: Request, ctx: { params: Promise<{ id: string }> }) => {
  try {
    const { id } = await ctx.params
    const data = await svc.startSession(id)
    return NextResponse.json(data)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
})
