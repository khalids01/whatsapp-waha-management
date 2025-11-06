"use client"

import React from "react"
import { useCreateSession, useSessions, useStartSession, useStopSession } from "@/features/sessions/hooks"
import type { CreateSessionBody } from "@/features/sessions/schemas"

export default function Home() {
  const { data, isLoading, isError, error } = useSessions()
  const create = useCreateSession()
  const start = useStartSession()
  const stop = useStopSession()

  const [name, setName] = React.useState("")
  const [engine, setEngine] = React.useState<CreateSessionBody["engine"] | "">("")

  return (
    <div className="min-h-screen p-6 space-y-6">
      <h1 className="text-2xl font-semibold">WAHA Dashboard</h1>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Create Session</h2>
        <div className="flex gap-2 items-center">
          <input
            className="border rounded px-3 py-2 w-60"
            placeholder="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <select
            className="border rounded px-3 py-2"
            value={engine}
            onChange={(e) =>
              setEngine((e.target.value as CreateSessionBody["engine"]) || "")
            }
          >
            <option value="">engine (optional)</option>
            <option value="webjs">webjs</option>
            <option value="whatsapp-web">whatsapp-web</option>
            <option value="go-whatsapp">go-whatsapp</option>
          </select>
          <button
            className="px-4 py-2 rounded bg-black text-white disabled:opacity-50"
            disabled={!name || create.isPending}
            onClick={() =>
              create.mutate({ name, engine: engine || undefined })
            }
          >
            {create.isPending ? "Creating…" : "Create"}
          </button>
        </div>
        {create.isError ? (
          <div className="text-red-600 text-sm">{String((create.error as Error)?.message)}</div>
        ) : null}
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-medium">Sessions</h2>
        {isLoading ? (
          <div>Loading…</div>
        ) : isError ? (
          <div className="text-red-600">{String((error as Error)?.message)}</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((s, i) => (
              <div key={i} className="border rounded p-4 space-y-2">
                <div className="font-mono text-sm break-all">{s.id}</div>
                <div className="text-neutral-500">{s.state}</div>
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 rounded border"
                    onClick={() => start.mutate(s.id)}
                    disabled={start.isPending}
                  >
                    Start
                  </button>
                  <button
                    className="px-3 py-1 rounded border"
                    onClick={() => stop.mutate(s.id)}
                    disabled={stop.isPending}
                  >
                    Stop
                  </button>
                </div>
              </div>
            ))}
            {!data?.data?.length && <div className="text-neutral-500">No sessions yet.</div>}
          </div>
        )}
      </section>
    </div>
  )
}
