"use client"

import Link from "next/link"
import { ThemeToggle } from "@/components/theme-toggle"
import { Button } from "@/components/ui/button"
import { endpoints } from "@/constants/endpoints"

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b bg-background/60 backdrop-blur">
        <div className="mx-auto w-full max-w-6xl px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-block size-6 rounded bg-primary/20" />
            <span className="font-semibold">WAHA Manager</span>
          </Link>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link href={endpoints.pages.signin}>
              <Button>Sign In</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="flex-1">
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:py-24">
          <div className="text-center space-y-6">
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">
              Open‑source dashboard for WAHA
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Manage sessions, send messages, and explore APIs with a clean, modern UI. Built with Next.js, React Query, and Shadcn UI.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link href="/docs">
                <Button size="lg">View Docs</Button>
              </Link>
              <Link href={endpoints.pages.dashboard}>
                <Button size="lg" variant="secondary">Go to Dashboard</Button>
              </Link>
            </div>
          </div>

          {/* Mini features */}
          <div className="grid mt-14 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <Feature title="Sessions" desc="Create, start, stop and monitor WAHA sessions." />
            <Feature title="Messaging" desc="Send messages right from your dashboard." />
            <Feature title="API Runner" desc="Interactive API tests with live responses." />
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <div className="mx-auto w-full max-w-6xl px-4">
          <span>Made with ❤️ for the WAHA community • MIT Licensed</span>
        </div>
      </footer>
    </div>
  )
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="rounded-lg border p-4 bg-muted/30">
      <div className="font-medium">{title}</div>
      <div className="text-sm text-muted-foreground">{desc}</div>
    </div>
  )
}
