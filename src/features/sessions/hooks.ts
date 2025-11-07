"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import type { CreateSessionBody, Session } from "./schemas"

export function useSessions() {
  return useQuery<{ data: Session[] }>({
    queryKey: ["sessions"],
    queryFn: async () => {
      const res = await fetch("/api/sessions", { cache: "no-store" })
      if (!res.ok) throw new Error(`Failed to fetch sessions: ${res.status}`)
      const data = (await res.json()) as Session[]
      return { data }
    },
    refetchInterval: (q) => {
      const payload = (q.state.data as { data: Session[] } | undefined)?.data
      const isStarting = payload?.some((s) => (s.state ?? "").toUpperCase() === "STARTING") ?? false
      return isStarting ? 5000 : false
    },
  })
}

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (payload: CreateSessionBody) => {
      const res = await fetch("/api/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error(await res.text())
      return (await res.json()) as Session
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["sessions"] })
    },
  })
}

export function useStartSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sessions/${id}/start`, { method: "POST" })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  })
}

export function useStopSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sessions/${id}/stop`, { method: "POST" })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  })
}

export function useDeleteSession() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/sessions/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error(await res.text())
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["sessions"] }),
  })
}

export function useSessionQR(id: string | null, enabled: boolean) {
  return useQuery<{ png: string }>({
    queryKey: ["session-qr", id],
    enabled: !!id && enabled,
    queryFn: async () => {
      const res = await fetch(`/api/sessions/${id}/qr`)
      if (!res.ok) throw new Error(await res.text())
      return (await res.json()) as { png: string }
    },
    staleTime: 0,
  })
}
