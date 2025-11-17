export const env = {
  PORT: process.env.PORT,
  WAHA_BASE_URL: process.env.WAHA_BASE_URL,
  // --- WAHA CONFIG ---
  WHATSAPP_API_PORT: process.env.WHATSAPP_API_PORT,
  WHATSAPP_API_HOSTNAME: process.env.WHATSAPP_API_HOSTNAME,
  WAHA_DEBUG_MODE: process.env.WAHA_DEBUG_MODE,
  // --- SECURITY ---
  WAHA_API_KEY: process.env.WAHA_API_KEY,
  WAHA_DASHBOARD_USERNAME: process.env.WAHA_DASHBOARD_USERNAME,
  WAHA_DASHBOARD_PASSWORD: process.env.WAHA_DASHBOARD_PASSWORD,
  // --- SYSTEM ---
  TZ: process.env.TZ,


  EMAIL: process.env.EMAIL,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
  EMAIL_FROM: process.env.EMAIL_FROM,
  SMTP_HOST: process.env.SMTP_HOST,
  SMTP_PORT: process.env.SMTP_PORT,

  ENABLE_SIGNUP: process.env.ENABLE_SIGNUP,

} as const

export type Env = typeof env
