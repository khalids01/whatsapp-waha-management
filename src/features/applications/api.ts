"use client"

import { api } from "@/lib/api"

export type AppDto = { id: string; name: string; slug: string; createdAt: string; updatedAt: string }
export type ApiKeyDto = { id: string; prefix: string; lastFour: string; enabled: boolean; createdAt: string }

export const qk = {
  apps: ["apps"] as const,
  keys: (slug: string) => ["apps", slug, "keys"] as const,
}

export async function listApps() {
  const { data } = await api.get<AppDto[]>("/api/applications", { withCredentials: true })
  return data
}

export async function createApp(name: string) {
  const { data } = await api.post<{ id: string; name: string; slug: string }>("/api/applications", { name })
  return data
}

export async function listKeys(slug: string) {
  const { data } = await api.get<ApiKeyDto[]>(`/api/applications/${encodeURIComponent(slug)}/keys`)
  return data
}

export async function createKey(slug: string) {
  const { data } = await api.post<{ id: string; key: string; prefix: string; lastFour: string; enabled: boolean; createdAt: string }>(
    `/api/applications/${encodeURIComponent(slug)}/keys`
  )
  return data
}

export async function toggleKey(slug: string, id: string, enabled: boolean) {
  const { data } = await api.patch<ApiKeyDto>(
    `/api/applications/${encodeURIComponent(slug)}/keys/${encodeURIComponent(id)}`,
    { enabled }
  )
  return data
}

export async function deleteKey(slug: string, id: string) {
  const { data } = await api.delete<{ ok: true }>(
    `/api/applications/${encodeURIComponent(slug)}/keys/${encodeURIComponent(id)}`
  )
  return data
}
