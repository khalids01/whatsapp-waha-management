"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Skeleton } from "@/components/ui/skeleton"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useApplications } from "@/hooks/useApplications"

export default function ManageApplicationPage() {
  const params = useParams<{ slug: string }>()
  const slug = params.slug

  const { keysQuery, createKeyMutation, toggleKeyMutation, deleteKeyMutation } = useApplications({ slug })
  const { data: keys, isFetching, error, refetch } = keysQuery
  const [showKey, setShowKey] = useState<string | null>(null)

  useEffect(() => {
    refetch()
  }, [refetch])

  const sendEndpoint = useMemo(() => {
    if (typeof window === "undefined") return ""
    return `${window.location.origin}/api/applications/${encodeURIComponent(slug)}/send`
  }, [slug])

  function onCreate() {
    createKeyMutation.mutate(undefined, {
      onSuccess: (created) => setShowKey(created.data.key),
    })
  }

  function onToggle(id: string, enabled: boolean) {
    toggleKeyMutation.mutate({ id, enabled })
  }

  function onDelete(id: string) {
    deleteKeyMutation.mutate(id)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">{slug}</h1>
        <Button onClick={onCreate} disabled={createKeyMutation.isPending}>
          {createKeyMutation.isPending ? "Creating..." : "Create API Key"}
        </Button>
      </div>
      {error ? <p className="text-sm text-red-500">{String(error)}</p> : null}

      <section className="space-y-2">
        <h2 className="text-lg font-medium">Send Endpoint</h2>
        <Card>
          <CardContent className="pt-4 space-y-2">
            <div>
              <div className="text-sm text-muted-foreground">POST URL</div>
              <Input readOnly value={sendEndpoint} onFocus={(e) => e.currentTarget.select()} />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Example cURL</div>
              <pre className="rounded-md bg-muted p-3 text-xs overflow-auto">
                {`curl -X POST "${sendEndpoint}" \
                  -H "x-api-key: <your-api-key>" \
                  -H "Content-Type: application/json" \
                  -d '{"to":"11111111111@c.us","text":"Hello!","sessionId":"default"}'`}
              </pre>
            </div>
          </CardContent>
        </Card>
      </section>

      <section className="space-y-2">
        <h2 className="text-lg font-medium">API Keys</h2>
        {isFetching ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
        ) : keys && keys.data && keys.data.length ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {keys.data.map((k) => (
              <Card key={k.id}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{k.prefix}…{k.lastFour}</CardTitle>
                </CardHeader>
                <CardFooter className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground">Enabled</span>
                    <Switch checked={k.enabled} onCheckedChange={(v) => onToggle(k.id, v)} disabled={toggleKeyMutation.isPending} />
                  </div>
                  <Button variant="destructive" size="sm" onClick={() => onDelete(k.id)} disabled={deleteKeyMutation.isPending}>
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No keys yet. Create one to get started.</p>
        )}
      </section>

      <Dialog open={!!showKey} onOpenChange={(o) => !o && setShowKey(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>API Key (copy now)</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            This is the only time you can see the full API key. Copy and store it securely.
          </p>
          <Input readOnly value={showKey ?? ""} onFocus={(e) => e.currentTarget.select()} />
          <DialogFooter>
            <Button onClick={() => setShowKey(null)}>Done</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
