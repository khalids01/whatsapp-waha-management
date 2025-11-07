import { wahaClient } from "@/lib/wahaClient"
import type { CreateSessionBody, WahaSessionRaw } from "./schemas"
import { endpoints } from "@/constants/endpoints"

export async function createSession(payload: CreateSessionBody): Promise<WahaSessionRaw> {
  const res = await wahaClient.post<WahaSessionRaw>(endpoints.waha.session.list, payload)
  return res.data
}

export async function listSessions(): Promise<WahaSessionRaw[]> {
  const res = await wahaClient.get<WahaSessionRaw[]>(endpoints.waha.session.list + "?all=true")
  return res.data
}

export async function getSessionQR(id: string): Promise<ArrayBuffer> {
  const res = await wahaClient.get(endpoints.waha.auth.qr(id) + "?format=image", {
    responseType: "arraybuffer",
    headers: { Accept: "image/png" },
  })
  return res.data as ArrayBuffer
}

export async function startSession(id: string) {
  const res = await wahaClient.post(endpoints.waha.session.start(id), {})
  return res.data
}

export async function stopSession(id: string) {
  const res = await wahaClient.post(endpoints.waha.session.stop(id), {})
  return res.data
}

export async function deleteSession(id: string) {
  const res = await wahaClient.delete(endpoints.waha.session.delete(id))
  return res.data
}
