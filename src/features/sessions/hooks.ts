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
