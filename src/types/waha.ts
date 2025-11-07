export interface WahaHealth {
  status: "ok" | "error" | string
  info?: Record<string, unknown>
  error?: Record<string, unknown>
  details?: Record<string, unknown>
}
