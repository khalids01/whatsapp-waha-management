import { NextResponse } from "next/server"
import * as svc from "@/features/sessions/services"

export async function GET(_req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await svc.getSessionQR(params.id)
    return NextResponse.json(data)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
