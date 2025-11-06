"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function SignInPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await authClient.signIn.email(
      { email, password, callbackURL: "/" },
      {
        onError: (ctx) => setError(ctx.error.message),
      }
    )
    setLoading(false)
    if (!error) router.push("/")
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h1>Sign In</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
        </div>
        <div>
          <label>Password</label>
          <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
        </div>
        {error ? <p style={{ color: "red" }}>{error}</p> : null}
        <button disabled={loading} type="submit">
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
    </div>
  )
}
