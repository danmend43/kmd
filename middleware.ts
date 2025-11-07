import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Permitir acesso público à rota de login
  if (pathname === '/login') {
    return NextResponse.next()
  }

  // Permitir acesso público às rotas de catálogo (páginas)
  if (pathname.startsWith('/catalog')) {
    return NextResponse.next()
  }

  // Permitir rotas de autenticação (login, verify, logout)
  if (pathname.startsWith('/api/auth')) {
    return NextResponse.next()
  }

  // Permitir acesso público ao GET de catalog-config (API usada pela página pública)
  if (pathname === '/api/catalog-config' && request.method === 'GET') {
    return NextResponse.next()
  }

  // Permitir acesso público ao GET de accounts (usado pela página de catálogo)
  if (pathname === '/api/accounts' && request.method === 'GET') {
    return NextResponse.next()
  }

  // Permitir acesso público ao GET de load-last-history (usado pela página de catálogo)
  if (pathname === '/api/load-last-history' && request.method === 'GET') {
    return NextResponse.next()
  }

  // Verificar se o usuário está autenticado
  const authToken = request.cookies.get('auth-token')

  // Para rotas de API, deixar que cada rota verifique individualmente
  // (elas retornarão JSON de erro ao invés de redirecionar)
  if (pathname.startsWith('/api/')) {
    return NextResponse.next()
  }

  // Para páginas, redirecionar para login se não autenticado
  if (!authToken) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (rotas de autenticação)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api/auth|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
