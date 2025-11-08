import { NextRequest, NextResponse } from 'next/server'
import { auth } from "@/lib/auth"
import { headers } from 'next/headers'
type SessionPayload = NonNullable<Awaited<ReturnType<typeof auth.api.getSession>>>

export function withAuth<TCtx = unknown>(
  handler: (req: NextRequest, ctx: TCtx, session: SessionPayload) => Promise<Response>
) {
  return async (req: NextRequest, ctx: TCtx) => {
    const session = await auth.api.getSession({ headers: await headers() })

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    return handler(req, ctx, session)
  }
}
