import { wahaClient } from "@/lib/wahaClient"
import type { CreateSessionBody, WahaSessionRaw } from "./schemas"

export async function createSession(payload: CreateSessionBody): Promise<WahaSessionRaw> {
  const res = await wahaClient.post<WahaSessionRaw>(`/sessions`, payload)
  return res.data
}

export async function listSessions(): Promise<WahaSessionRaw[]> {
  const res = await wahaClient.get<WahaSessionRaw[]>(`/sessions?all=true`)
  return res.data
}

export async function getSessionQR(id: string): Promise<ArrayBuffer> {
  const res = await wahaClient.get(`/` + encodeURIComponent(id) + `/auth/qr?format=image`, {
    responseType: "arraybuffer",
    headers: { Accept: "image/png" },
  })
  return res.data as ArrayBuffer
}

export async function startSession(id: string) {
  const res = await wahaClient.post(`/sessions/${id}/start`, {})
  return res.data
}

export async function stopSession(id: string) {
  const res = await wahaClient.post(`/sessions/${id}/stop`, {})
  return res.data
}

export async function deleteSession(id: string) {
  const res = await wahaClient.delete(`/sessions/${id}`)
  return res.data
}
