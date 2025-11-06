import { NextResponse } from "next/server"
import { CreateSessionBodySchema } from "@/features/sessions/schemas"
import * as svc from "@/features/sessions/services"

export async function GET() {
  try {
    const data = await svc.listSessions()
    return NextResponse.json(data)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json()
    const parsed = CreateSessionBodySchema.parse(json)
    const data = await svc.createSession(parsed)
    return NextResponse.json(data, { status: 201 })
  } catch (e: unknown) {
    const isZod = typeof e === "object" && e !== null && (e as { name?: string }).name === "ZodError"
    const message = e instanceof Error ? e.message : "Unexpected error"
    const code = isZod ? 400 : 500
    return NextResponse.json({ error: message }, { status: code })
  }
}
