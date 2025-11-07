import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import prisma from "@/lib/prisma"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { wahaClient } from "@/lib/wahaClient"
import { endpoints } from "@/constants/endpoints"
import type { WahaHealth } from "@/types/waha"
import { api } from "@/lib/api"

export default async function HomePage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
        <p className="text-sm text-muted-foreground">You must be signed in.</p>
      </div>
    )
  }

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
        const resp = await api.get<WahaHealth>(endpoints.api.overview)
        console.log(resp.data)
        return resp.data
      } catch {
        return null
      }
    })(),
  ])

  console.log(wahaHealth)

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold tracking-tight">Overview</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard title="Applications" value={appsCount} />
        <StatCard title="API Keys" value={keysCount} />
        <StatCard title="Messages" value={messagesAgg._count._all} />
        <StatCard title="WAHA" value={wahaHealth && wahaHealth.status === "ok" ? "Online" : "Offline"} />
      </div>
    </div>
  )
}

function StatCard({ title, value }: { title: string; value: string | number }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm text-muted-foreground">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-semibold">{value}</div>
      </CardContent>
    </Card>
  )
}
