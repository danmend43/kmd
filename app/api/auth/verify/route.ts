import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const authToken = request.cookies.get('auth-token')

  if (authToken) {
    return NextResponse.json({ authenticated: true })
  } else {
    return NextResponse.json({ authenticated: false }, { status: 401 })
  }
}


