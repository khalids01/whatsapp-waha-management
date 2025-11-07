export const appConfig = {
  title: "WAHA Dashboard",
  description: "Manage WhatsApp sessions via WAHA API",
  sessionTokenName: "waha_management_session_token"
} as const

export type AppConfig = typeof appConfig
