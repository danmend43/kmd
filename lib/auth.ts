import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from './jwt'

export function verifyAuth(request: NextRequest): { authenticated: boolean; response?: NextResponse } {
  const authToken = request.cookies.get('auth-token')

  if (!authToken) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Não autorizado. Faça login para continuar.' },
        { status: 401 }
      ),
    }
  }

  // Verificar se o token JWT é válido
  const payload = verifyToken(authToken.value)
  if (!payload) {
    return {
      authenticated: false,
      response: NextResponse.json(
        { error: 'Token inválido ou expirado. Faça login novamente.' },
        { status: 401 }
      ),
    }
  }

  return { authenticated: true }
}
