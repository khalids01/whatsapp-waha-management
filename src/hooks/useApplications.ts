"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { api } from "@/lib/api"
import { endpoints } from "@/constants/endpoints"
import { queryKeys as qk } from "@/constants/queryKeys"

export type AppDto = { id: string; name: string; slug: string; createdAt: string; updatedAt: string }
export type ApiKeyDto = { id: string; prefix: string; lastFour: string; enabled: boolean; createdAt: string }


export function useApplications(opts?: { slug?: string }) {
  const slug = opts?.slug
  const qc = useQueryClient()

  const listQuery = useQuery({ queryKey: qk.apps, queryFn: () => api.get<AppDto[]>(endpoints.api.applications, { withCredentials: true }), enabled: false })
  const appQuery = useQuery({ queryKey: slug ? qk.app(slug) : qk.app(""), queryFn: () => api.get<AppDto>(endpoints.api.app(slug as string)), enabled: !!slug })

  const keysQuery = useQuery({
    queryKey: slug ? qk.keys(slug) : qk.keys(""),
    queryFn: () => api.get<ApiKeyDto[]>(endpoints.api.keys(slug as string)),
    enabled: false,
  })

  const createAppMutation = useMutation({
    mutationFn: (name: string) => api.post<{ id: string; name: string; slug: string }>(endpoints.api.applications, { name }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: qk.apps })
    },
  })

  const createKeyMutation = useMutation({
    mutationFn: () => api.post<{ id: string; key: string; prefix: string; lastFour: string; enabled: boolean; createdAt: string }>(endpoints.api.keys(slug as string)),
    onSuccess: async () => {
      if (slug) await qc.invalidateQueries({ queryKey: qk.keys(slug) })
    },
  })

  const toggleKeyMutation = useMutation({
    mutationFn: (vars: { id: string; enabled: boolean }) => api.patch<ApiKeyDto>(endpoints.api.key(slug as string, vars.id), { enabled: vars.enabled }),
    onSuccess: async () => {
      if (slug) await qc.invalidateQueries({ queryKey: qk.keys(slug) })
    },
  })

  const deleteKeyMutation = useMutation({
    mutationFn: (id: string) => api.delete<{ ok: true }>(endpoints.api.key(slug as string, id)),
    onSuccess: async () => {
      if (slug) await qc.invalidateQueries({ queryKey: qk.keys(slug) })
    },
  })

  function revalidate() {
    qc.invalidateQueries({ queryKey: qk.apps })
    if (slug) qc.invalidateQueries({ queryKey: qk.keys(slug) })
  }

  return {
    listQuery,
    appQuery,
    keysQuery,
    createAppMutation,
    createKeyMutation,
    toggleKeyMutation,
    deleteKeyMutation,
    revalidate,
    qk,
    endpoints,
  }
}
