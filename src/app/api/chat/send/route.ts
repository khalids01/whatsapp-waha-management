import { NextRequest } from "next/server"
import { wahaClient } from "@/lib/wahaClient"
import { endpoints } from "@/constants/endpoints"
import { withAuthOrApiKey } from "@/lib/withAuthOrApiKey"
export const POST = withAuthOrApiKey(async (req: NextRequest) => {
  try {
    const { sessionId, session, to, chatId, text, reply_to = null, linkPreview = true, linkPreviewHighQuality = false } = await req.json()

    const payload = {
      chatId: chatId ?? to,
      reply_to,
      text,
      linkPreview,
      linkPreviewHighQuality,
      session: session ?? sessionId ?? "default",
    }

    if (!payload.chatId || !payload.text) {
      return new Response(JSON.stringify({ error: "chatId/to and text are required" }), { status: 400 })
    }

    const res = await wahaClient.post(endpoints.waha.chatting.send, payload)
    return new Response(JSON.stringify(res.data), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    const status = e?.response?.status ?? 500
    const data = e?.response?.data ?? { error: e?.message ?? "unknown_error" }
    return new Response(typeof data === "string" ? data : JSON.stringify(data), {
      status,
      headers: { "Content-Type": "application/json" },
    })
  }
})

