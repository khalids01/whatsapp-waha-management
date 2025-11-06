"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "@/lib/auth-client"

export default function SignUpPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await authClient.signUp.email(
      { email, password, name, callbackURL: "/" },
      {
        onError: (ctx) => setError(ctx.error.message),
      }
    )
    setLoading(false)
    if (!error) router.push("/")
  }

  return (
    <div style={{ maxWidth: 360, margin: "40px auto" }}>
      <h1>Sign Up</h1>
      <form onSubmit={onSubmit}>
        <div>
          <label>Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} type="text" />
        </div>
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
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </div>
  )
}
