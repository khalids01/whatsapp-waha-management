// middleware.ts (in project root)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { appConfig } from './appConfig'

export function middleware(req: NextRequest) {
  // Example: simple auth guard
  const token = req.cookies.get(appConfig.sessionTokenName)
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // continue request
  return NextResponse.next()
}

// Apply only to API routes
export const config = {
  matcher: ['/api/:path*'],
}
