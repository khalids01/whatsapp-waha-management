import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { wahaClient } from "@/lib/wahaClient"
import { endpoints } from "@/constants/endpoints"
import type { WahaHealth } from "@/types/waha"

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() })
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

    const [appsCount, keysCount, messagesAgg, wahaHealth] = await Promise.all([
      prisma.application.count({ where: { userId: session.user.id } }),
      prisma.apiKey.count({ where: { application: { userId: session.user.id } } }),
      prisma.message.aggregate({
        _count: { _all: true },
        _max: { createdAt: true },
        where: { application: { userId: session.user.id } },
      }),
      (async () => {
        try {
          const resp = await wahaClient.get<WahaHealth>(endpoints.waha.observability.health)
          console.log({resp})
          return resp.data
        } catch {
          return null
        }
      })(),
    ])

    return NextResponse.json({
      appsCount,
      keysCount,
      messagesCount: messagesAgg._count._all,
      lastMessageAt: messagesAgg._max.createdAt,
      waha: { 
        health: wahaHealth,
        lastMessageAt: messagesAgg._max.createdAt
      },
    })
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Unexpected error"
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
