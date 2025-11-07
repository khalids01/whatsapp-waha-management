"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { endpoints } from "@/constants/endpoints"
import { queryKeys as qk } from "@/constants/queryKeys"
import { wahaClient } from "@/lib/wahaClient"

export type SessionDto = { id: string; state?: string; name?: string }

export function useSessions(opts?: { id?: string }) {
  const id = opts?.id
  const qc = useQueryClient()

  const listQuery = useQuery({ queryKey: qk.sessions, queryFn: () => wahaClient.get<SessionDto[]>(endpoints.waha.session.list), enabled: false })
  const sessionQuery = useQuery({ queryKey: id ? qk.session(id) : qk.session(""), queryFn: async () => ({} as SessionDto), enabled: !!id })

  const createSessionMutation = useMutation({
    mutationFn: (sid: string) => wahaClient.post<SessionDto>(endpoints.waha.session.single(sid), { id: sid }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.sessions })
    },
  })

  const deleteSessionMutation = useMutation({
    mutationFn: (sid: string) => wahaClient.delete<{ ok: true }>(endpoints.waha.session.single(sid)),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.sessions })
    },
  })

  function revalidate() {
    qc.invalidateQueries({ queryKey: qk.sessions })
    if (id) qc.invalidateQueries({ queryKey: qk.session(id) })
  }

  return {
    listQuery,
    sessionQuery,
    createSessionMutation,
    deleteSessionMutation,
    revalidate,
    qk,
    endpoints,
  }
}
