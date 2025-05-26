import { NextResponse } from 'next/server'
//import { getToken } from 'next-auth/jwt'

export async function middleware(req) {
  const token = req.cookies.get('token')?.value
  const url = req.nextUrl.clone()

  if (!token && url.pathname.startsWith('/test')) {
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/test', '/temario'],
}
