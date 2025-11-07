import axios from "axios"

export const api = axios.create({
  baseURL: typeof window === "undefined" ? process.env.NEXT_PUBLIC_APP_URL ?? "" : "",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
})

// Example usage:
// const res = await api.get('/api/dashboard/overview')
