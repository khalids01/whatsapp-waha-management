import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import ApiTester from "@/components/docs/ApiTester"
import { apiDocs } from "@/constants/apiDocs"

export default async function DocsPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-semibold tracking-tight">API Documentation</h1>
        <p className="text-sm text-muted-foreground">You must be signed in.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">API Documentation</h1>
        <p className="text-sm text-muted-foreground">Test endpoints directly from this page. Your auth session is used automatically. For the send endpoint, provide your API key.</p>
      </div>

      <div className="grid gap-6">
        {apiDocs.map((ep) => (
          <ApiTester key={ep.id} endpoint={ep} />
        ))}
      </div>
    </div>
  )
}
