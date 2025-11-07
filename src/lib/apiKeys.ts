import crypto from "crypto"

export function hashApiKey(key: string, pepper = process.env.APP_API_KEY_PEPPER ?? "") {
  const h = crypto.createHash("sha256")
  h.update(pepper + key)
  return h.digest("hex")
}

export function deriveDisplayParts(key: string) {
  const prefix = key.slice(0, 4)
  const lastFour = key.slice(-4)
  return { prefix, lastFour }
}

export function safeCompare(a: string, b: string) {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return crypto.timingSafeEqual(bufA, bufB)
}

export function generateApiKey() {
  const random = crypto.randomBytes(24).toString("base64url") // ~32 chars url-safe
  const key = `app_${random}`
  const { prefix, lastFour } = deriveDisplayParts(key)
  return { key, prefix, lastFour }
}
