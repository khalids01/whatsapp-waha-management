import { NextResponse } from "next/server"
import * as svc from "@/features/sessions/services"

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await ctx.params
    const buf = await svc.getSessionQR(id)
    const base64 = Buffer.from(buf).toString("base64")
    const dataUrl = `data:image/png;base64,${base64}`
    return NextResponse.json({ png: dataUrl })
  } catch (e: unknown) {
    const maybeStatus =
      typeof e === "object" && e !== null && (e as { response?: { status: number } }).response?.status
    if (maybeStatus === 404) {
      // No QR available yet; return empty svg so UI can show a friendly message
      return NextResponse.json({ png: "" })
    }
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
