"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useApplications } from "@/hooks/useApplications"

export default function ApplicationsPage() {
  const { listQuery, createAppMutation } = useApplications()
  const { data: apps, isFetching, error, refetch } = listQuery
  const [open, setOpen] = useState(false)
  const [name, setName] = useState("")

  useEffect(() => {
    refetch()
  }, [refetch])

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>Create Application</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Application</DialogTitle>
            </DialogHeader>
            <div className="space-y-2">
              <label className="text-sm">Name</label>
              <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="My App" />
            </div>
            <DialogFooter>
              <Button variant="ghost" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                onClick={() =>
                  createAppMutation.mutate(name, {
                    onSuccess: () => {
                      setOpen(false)
                      setName("")
                    },
                  })
                }
                disabled={!name || createAppMutation.isPending}
              >
                {createAppMutation.isPending ? "Creating..." : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isFetching ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      ) : error ? (
        <p className="text-sm text-red-500">{String(error)}</p>
      ) : apps && apps.data && apps.data.length ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {apps.data.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle className="text-base">{app.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground break-all">Slug: {app.slug}</div>
              </CardContent>
              <CardFooter className="justify-between">
                <Link className="text-sm underline" href={`/dashboard/applications/${encodeURIComponent(app.slug)}`}>
                  Manage Keys
                </Link>
                <Link className="text-sm text-muted-foreground" href={`/api/applications/${encodeURIComponent(app.slug)}/keys`}>
                  API
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No applications yet. Create one to get started.</p>
      )}
    </div>
  )
}
