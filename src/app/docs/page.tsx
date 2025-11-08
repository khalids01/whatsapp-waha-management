"use client"
import { useMemo, useState } from "react"
import { apiDocs } from "@/constants/apiDocs"
import ApiTester from "@/components/docs/ApiTester"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ThemeToggle } from "@/components/theme-toggle"

export default function PublicDocsPage() {
  const [apiKey, setApiKey] = useState("")
  const [activeId, setActiveId] = useState(apiDocs[0]?.id ?? "")
  const active = useMemo(() => apiDocs.find((e) => e.id === activeId) ?? apiDocs[0], [activeId])

  return (
    <div className="flex min-h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <aside className="w-72 shrink-0 border-r bg-background">
        <div className="p-4">
          <div className="text-xs text-muted-foreground mb-2">API Testing</div>
          <Input placeholder="API Key (x-api-key)" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
        </div>
        <Separator />
        <nav className="p-2 space-y-1">
          {apiDocs.map((ep) => (
            <button
              key={ep.id}
              onClick={() => setActiveId(ep.id)}
              className={`w-full text-left px-3 py-2 rounded transition-colors text-sm ${activeId === ep.id ? "bg-muted" : "hover:bg-muted/60"
                }`}
            >
              <span className="mr-2 inline-block align-middle font-mono text-[10px] px-1.5 py-0.5 rounded bg-secondary">
                {ep.method}
              </span>
              <span className="align-middle">{ep.title}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Content */}
      <main className="flex-1 pb-8 ">
        <header className="flex items-center justify-between py-2 border-b mb-2 px-6">
          <h3>Api Docs</h3>
          <ThemeToggle />
        </header>
        {/* Page header (use home page style: simple heading at top) */}
        <div className="mb-6 px-6 ">
          <h1 className="text-2xl font-semibold tracking-tight">API Documentation</h1>
          <p className="text-sm text-muted-foreground">Browse endpoints on the left. Click Test Request to open the interactive runner.</p>
        </div>

        <Card className="mx-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between ">
              <div>
                <div className="text-sm text-muted-foreground font-mono">{active.method} {active.path}</div>
                <div>{active.title}</div>
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button>Test Request</Button>
                </DialogTrigger>
                <DialogContent className="max-w-7xl! w-[95vw]">
                  <DialogHeader>
                    <DialogTitle>Test: {active.title}</DialogTitle>
                  </DialogHeader>
                  <ApiTester endpoint={active} defaultApiKey={apiKey} />
                </DialogContent>
              </Dialog>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {active.description && <p className="text-sm text-muted-foreground">{active.description}</p>}

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Headers</h3>
              <div className="rounded border text-sm p-3 bg-muted/30">
                <div className="flex items-center justify-between">
                  <div className="font-mono">Content-Type: application/json</div>
                </div>
                {active.requiresApiKey && (
                  <div className="font-mono mt-1">x-api-key: &lt;your_api_key&gt;</div>
                )}
              </div>
            </section>

            {active.sampleBody !== undefined && active.sampleBody !== null && (
              <section className="space-y-2">
                <h3 className="text-sm font-medium">Body</h3>
                <pre className="text-sm rounded border p-3 bg-muted/30 overflow-auto">
                  {JSON.stringify(active.sampleBody, null, 2)}
                </pre>
              </section>
            )}

            <section className="space-y-2">
              <h3 className="text-sm font-medium">Expected Response</h3>
              <pre className="text-sm rounded border p-3 bg-muted/30 overflow-auto">
                {active.expectedResponse ? JSON.stringify(active.expectedResponse, null, 2) : "-"}
              </pre>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
