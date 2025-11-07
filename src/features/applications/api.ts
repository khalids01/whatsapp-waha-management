"use client"

export type AppDto = { id: string; name: string; slug: string; createdAt: string; updatedAt: string }
export type ApiKeyDto = { id: string; prefix: string; lastFour: string; enabled: boolean; createdAt: string }

export async function listApps() {
  const res = await fetch("/api/applications", { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as AppDto[]
}

export async function createApp(name: string) {
  const res = await fetch("/api/applications", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as { id: string; name: string; slug: string }
}

export async function listKeys(slug: string) {
  const res = await fetch(`/api/applications/${encodeURIComponent(slug)}/keys`, { cache: "no-store" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as ApiKeyDto[]
}

export async function createKey(slug: string) {
  const res = await fetch(`/api/applications/${encodeURIComponent(slug)}/keys`, { method: "POST" })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as { id: string; key: string; prefix: string; lastFour: string; enabled: boolean; createdAt: string }
}

export async function toggleKey(slug: string, id: string, enabled: boolean) {
  const res = await fetch(`/api/applications/${encodeURIComponent(slug)}/keys/${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ enabled }),
  })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as ApiKeyDto
}

export async function deleteKey(slug: string, id: string) {
  const res = await fetch(`/api/applications/${encodeURIComponent(slug)}/keys/${encodeURIComponent(id)}`, {
    method: "DELETE",
  })
  if (!res.ok) throw new Error(await res.text())
  return (await res.json()) as { ok: true }
}
