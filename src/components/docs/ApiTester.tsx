"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@/hooks/useChat"
import axios from "axios"
import { useMutation } from "@tanstack/react-query"

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
  const [url, setUrl] = useState(endpoint.path)
  const [body, setBody] = useState(endpoint.sampleBody ? JSON.stringify(endpoint.sampleBody, null, 2) : "")

  const { mutate, isPending, data } = useMutation({
    mutationFn: async (body: { sessionId: string, to: string, text: string }) => {
      const res = await axios.post(url, body, {
        headers: {
          "Content-Type": "application/json",
          "x-api-key": apiKey,
        },
      })
      return res
    },
  })



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
        <div className="space-y-1">
          <label className="text-sm">URL</label>
          <Input value={url} onChange={(e) => setUrl(e.target.value)} placeholder={endpoint.path} />
        </div>
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
              <div className="text-sm font-medium">{isPending ? "Actual Response" : "Expected Response"}</div>
              {isPending && <div className="text-[10px] text-muted-foreground font-mono">{isPending}</div>}
            </div>
            <Textarea
              readOnly
              value={
                isPending
                  ? data
                  : (endpoint.expectedResponse ? JSON.stringify(endpoint.expectedResponse, null, 2) : "-")
              }
              className="font-mono min-h-40"
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => mutate(JSON.parse(body))} disabled={isPending}>{isPending ? "Sending..." : "Send Request"}</Button>
        </div>
      </CardContent>
    </Card>
  )
}
