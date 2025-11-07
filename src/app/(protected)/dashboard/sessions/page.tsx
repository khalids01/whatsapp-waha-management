"use client"

import React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { ConfirmWithPhraseSheet } from "@/components/common/ConfirmWithPhraseSheet"
import {
  useCreateSession,
  useDeleteSession,
  useSessionQR,
  useSessions,
  useStartSession,
  useStopSession,
} from "@/features/sessions/hooks"
import { CreateSessionBodySchema, type CreateSessionBody } from "@/features/sessions/schemas"
import { PlayIcon, SquareIcon, QrCodeIcon, Trash2Icon } from "lucide-react"

const engines: Array<{ label: string; value: NonNullable<CreateSessionBody["engine"]> }> = [
  { label: "webjs", value: "webjs" },
  { label: "whatsapp-web", value: "whatsapp-web" },
  { label: "go-whatsapp", value: "go-whatsapp" },
]

export default function SessionsPage() {
  const { data, isLoading, isError, error, isFetching, refetch } = useSessions()
  const create = useCreateSession()
  const start = useStartSession()
  const stop = useStopSession()
  const del = useDeleteSession()

  const form = useForm<CreateSessionBody>({
    resolver: zodResolver(CreateSessionBodySchema),
    defaultValues: { name: "", engine: undefined },
  })

  const [qrId, setQrId] = React.useState<string | null>(null)
  const [qrOpen, setQrOpen] = React.useState(false)
  const { data: qr, isLoading: qrLoading, refetch: refetchQr, isError: qrError, error: qrErr } = useSessionQR(qrId, qrOpen)

  const [confirmId, setConfirmId] = React.useState<string | null>(null)
  const [confirmError, setConfirmError] = React.useState<string | null>(null)
  const confirming = del.isPending

  const [stopId, setStopId] = React.useState<string | null>(null)

  function badgeVariantFor(state?: string) {
    const s = (state ?? "").toUpperCase()
    if (s === "WORKING" || s === "CONNECTED") return "default" as const
    if (s === "STARTING" || s === "INITIALIZING") return "secondary" as const
    if (s === "FAILED" || s === "ERROR") return "destructive" as const
    if (s === "STOPPED" || s === "INACTIVE") return "outline" as const
    return "secondary" as const
  }

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Sessions</h1>
        <p className="text-muted-foreground">Manage WAHA sessions: create, start, stop, delete, and view QR.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Session</CardTitle>
          <CardDescription>Provide a unique name and optional engine.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              className="grid gap-4 sm:grid-cols-[1fr_220px_auto] items-end"
              onSubmit={form.handleSubmit((values) => create.mutate(values, { onSuccess: () => form.reset() }))}
            >
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input placeholder="my-session" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="engine"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Engine (optional)</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value ?? undefined}
                        onValueChange={(v) => field.onChange(v === "none" ? undefined : v)}
                     >
                        <SelectTrigger>
                          <SelectValue placeholder="Select engine" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">No engine</SelectItem>
                          {engines.map((e) => (
                            <SelectItem key={e.value} value={e.value}>
                              {e.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? "Creating…" : "Create"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Existing Sessions</h2>
          <Button variant="outline" size="sm" onClick={() => refetch()} disabled={!!isFetching}>
            {isFetching ? "Refreshing…" : "Refresh"}
          </Button>
        </div>
        {isLoading ? (
          <div>Loading…</div>
        ) : isError ? (
          <div className="text-destructive text-sm">{String((error as Error)?.message)}</div>
        ) : (
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {data?.data?.map((s,i) => (
              <Card key={i}>
                <CardHeader>
                  <CardTitle className="text-base break-all font-mono">{s.id}</CardTitle>
                  <div className="mt-1">
                    <Badge variant={badgeVariantFor(s.state)} className="uppercase">
                      {s.state}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="icon-sm"
                    title="Start"
                    onClick={() => start.mutate(s.id)}
                    disabled={start.isPending}
                  >
                    <PlayIcon />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon-sm"
                    title="Stop"
                    onClick={() => setStopId(s.id)}
                    disabled={stop.isPending}
                  >
                    <SquareIcon />
                  </Button>

                  <Dialog
                    open={qrOpen && qrId === s.id}
                    onOpenChange={(open) => {
                      setQrOpen(open)
                      if (!open) setQrId(null)
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        title="Show QR"
                        onClick={() => {
                          setQrId(s.id)
                          setQrOpen(true)
                        }}
                      >
                        <QrCodeIcon />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>QR Code</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-3">
                        {qrLoading ? (
                          <div>Loading QR…</div>
                        ) : qrError ? (
                          <div className="text-destructive text-sm">{String((qrErr as Error)?.message)}</div>
                        ) : qr?.png ? (
                          <div className="flex flex-col items-center gap-3">
                            <div className="border rounded p-2 bg-white">
                              <img src={qr.png} alt="QR Code" className="max-w-full h-auto" />
                            </div>
                            <Button variant="outline" size="sm" onClick={() => refetchQr()}>
                              Refresh
                            </Button>
                          </div>
                        ) : (
                          <div className="text-muted-foreground text-sm">No QR available.</div>
                        )}
                      </div>
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="icon-sm"
                    title="Delete"
                    onClick={() => {
                      setConfirmError(null)
                      setConfirmId(s.id)
                    }}
                    disabled={(s.state ?? "").toUpperCase() === "WORKING"}
                  >
                    <Trash2Icon />
                  </Button>
                </CardContent>
              </Card>
            ))}
            {!data?.data?.length && <div className="text-muted-foreground">No sessions yet.</div>}
          </div>
        )}
      </div>
      <ConfirmWithPhraseSheet
        open={!!confirmId}
        onOpenChange={(open) => {
          if (!open) setConfirmId(null)
        }}
        title="Delete session?"
        description="This action cannot be undone. Type the phrase to confirm."
        confirmPhrase="delete this session"
        confirming={confirming}
        error={confirmError}
        onConfirm={async () => {
          if (!confirmId) return
          setConfirmError(null)
          try {
            await del.mutateAsync(confirmId)
            setConfirmId(null)
          } catch (e) {
            setConfirmError(String((e as Error)?.message ?? e))
          }
        }}
      />

      <AlertDialog open={!!stopId} onOpenChange={(open) => !open && setStopId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Stop working session?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to stop this working session?</p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (!stopId) return
                stop.mutate(stopId, { onSuccess: () => setStopId(null) })
              }}
            >
              Yes, stop it
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
