import { wahaClient } from "@/lib/wahaClient"
import type { CreateSessionBody, Session } from "./schemas"

export async function createSession(payload: CreateSessionBody): Promise<Session> {
  const res = await wahaClient.post<Session>(`/sessions`, payload)
  return res.data
}

export async function listSessions(): Promise<Session[]> {
  const res = await wahaClient.get<Session[]>(`/sessions?all=true`)
  return res.data
}

export async function getSessionQR(id: string): Promise<{ svg: string }> {
  const res = await wahaClient.get<{ svg: string }>(`/sessions/${id}/qr`)
  return res.data
}

export async function startSession(id: string) {
  const res = await wahaClient.post(`/sessions/${id}/start`, {})
  return res.data
}

export async function stopSession(id: string) {
  const res = await wahaClient.post(`/sessions/${id}/stop`, {})
  return res.data
}
