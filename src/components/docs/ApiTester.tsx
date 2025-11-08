"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export type ApiMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE"

export type ApiEndpoint = {
  id: string
  title: string
  path: string
  method: ApiMethod
  description?: string
  headers?: Record<string, string | undefined>
  requiresApiKey?: boolean
  sampleBody?: unknown
  expectedResponse?: unknown
}

export default function ApiTester({ endpoint, defaultApiKey }: { endpoint: ApiEndpoint; defaultApiKey?: string }) {
  const [apiKey, setApiKey] = useState(defaultApiKey ?? "")
  const [body, setBody] = useState(endpoint.sampleBody ? JSON.stringify(endpoint.sampleBody, null, 2) : "")
  const [loading, setLoading] = useState(false)
  const [respStatus, setRespStatus] = useState<string>("")
  const [respBody, setRespBody] = useState<string>("")

  const send = async () => {
    setLoading(true)
    setRespStatus("")
    setRespBody("")
    try {
      const headers: Record<string, string> = { "Content-Type": "application/json" }
      if (endpoint.headers) Object.entries(endpoint.headers).forEach(([k, v]) => v && (headers[k] = v))
      if (endpoint.requiresApiKey && apiKey) headers["x-api-key"] = apiKey

      const init: RequestInit = {
        method: endpoint.method,
        headers,
        credentials: "include",
      }
      if (endpoint.method !== "GET" && endpoint.method !== "DELETE" && body.trim()) {
        init.body = body
      }
      const res = await fetch(endpoint.path, init)
      setRespStatus(`${res.status} ${res.statusText}`)
      const text = await res.text()
      try {
        setRespBody(JSON.stringify(JSON.parse(text), null, 2))
      } catch {
        setRespBody(text)
      }
    } catch (e: unknown) {
      setRespStatus("request_failed")
      const msg = typeof e === "object" && e && "message" in e ? String((e as { message?: unknown }).message) : String(e)
      setRespBody(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{endpoint.title}</span>
          <span className="text-xs font-mono px-2 py-1 rounded bg-muted">{endpoint.method} {endpoint.path}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {endpoint.description && <p className="text-sm text-muted-foreground">{endpoint.description}</p>}
        {endpoint.requiresApiKey && (
          <div className="space-y-1">
            <label className="text-sm">API Key (sent as x-api-key)</label>
            <Input value={apiKey} onChange={(e) => setApiKey(e.target.value)} placeholder="sk_live_..." />
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <div className="text-sm font-medium">Body</div>
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="font-mono min-h-40"
              disabled={endpoint.method === "GET" || endpoint.method === "DELETE"}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium">{respStatus ? "Actual Response" : "Expected Response"}</div>
              {respStatus && <div className="text-[10px] text-muted-foreground font-mono">{respStatus}</div>}
            </div>
            <Textarea
              readOnly
              value={
                respStatus
                  ? respBody
                  : (endpoint.expectedResponse ? JSON.stringify(endpoint.expectedResponse, null, 2) : "-")
              }
              className="font-mono min-h-40"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={send} disabled={loading}>{loading ? "Sending..." : "Send Request"}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
