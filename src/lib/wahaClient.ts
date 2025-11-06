import axios from "axios"
import { env } from "@/env"

export const wahaClient = axios.create({
  baseURL: (env.WAHA_BASE_URL ?? "") + "/api",
  headers: {
    "Content-Type": "application/json",
    ...(env.WAHA_API_KEY ? { "x-api-key": env.WAHA_API_KEY } : {}),
  },
})

