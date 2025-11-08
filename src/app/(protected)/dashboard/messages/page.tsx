"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useChat } from "@/hooks/useChat"

export default function MessagesPage() {
  const [sessionId, setSessionId] = useState("default")
  const [to, setTo] = useState("")
  const [text, setText] = useState("")
  const { sendMessage:{mutate, isPending, data} } = useChat()



  return (
    <div className="space-y-4 max-w-3xl w-full mx-auto">
      <h1 className="text-2xl font-semibold tracking-tight">Messages</h1>
      <Card>
        <CardHeader>
          <CardTitle>Send Message</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm">Session ID</label>
              <Input value={sessionId} onChange={(e) => setSessionId(e.target.value)} placeholder="default" />
            </div>
            <div className="space-y-2">
              <label className="text-sm">To (JID)</label>
              <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="12025550123@c.us" />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-sm">Text</label>
            <Textarea value={text} onChange={(e) => setText(e.target.value)} className="min-h-32" />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <div className="text-sm font-medium">Body</div>
              <Textarea
                readOnly
                className="font-mono min-h-40"
                value={JSON.stringify({ sessionId, to, text }, null, 2)}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">{data ? "Response" : "Awaiting Send"}</div>
                {data && <div className="text-[10px] text-muted-foreground font-mono">{data.status} {data.statusText}</div>}
              </div>
              <Textarea readOnly className="font-mono min-h-40" value={data ? JSON.stringify(data.data, null, 2) : ""} />
            </div>
          </div>

          <div className="flex justify-end">
            <Button onClick={() => mutate({ sessionId, to, text })} disabled={isPending || !to || !text}>{isPending ? "Sending..." : "Send"}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
