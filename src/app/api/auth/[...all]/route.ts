import { auth } from "@/lib/auth"

// Disallow body parsing, we will parse it manually
// export const config = { api: { bodyParser: false } }

export const POST = auth.handler
export const GET = auth.handler
