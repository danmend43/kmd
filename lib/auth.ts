import { NextRequest, NextResponse } from 'next/server'

export function verifyAuth(request: NextRequest): { authenticated: boolean; response?: NextResponse } {
  const authToken = request.cookies.get('auth-token')
  
  if (authToken && authToken.value === 'authenticated') {
    return { authenticated: true }
  }
  
  return {
    authenticated: false,
    response: NextResponse.json(
      { error: 'Não autenticado' },
      { status: 401 }
    )
  }
}
