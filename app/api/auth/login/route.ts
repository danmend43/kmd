import { NextRequest, NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import { generateToken } from '@/lib/jwt'
import { checkRateLimit, recordFailedAttempt, clearAttempts } from '@/lib/rate-limit'

// Salvar fora da pasta public por segurança
const configFilePath = path.join(process.cwd(), 'auth-config.json')

// Valores padrão - usar variáveis de ambiente se disponíveis
const DEFAULT_USERNAME = process.env.DEFAULT_AUTH_USERNAME || 'danmend'
const DEFAULT_PASSWORD = process.env.DEFAULT_AUTH_PASSWORD || '202022'

// Cache do hash da senha para evitar recalcular toda vez
let cachedPasswordHash: string | null = null

// Carregar credenciais do arquivo ou usar padrões
async function getCredentials(): Promise<{ username: string; passwordHash: string }> {
  // No Vercel, priorizar variáveis de ambiente
  const envPasswordHash = process.env.DEFAULT_AUTH_PASSWORD_HASH
  if (envPasswordHash) {
    return {
      username: DEFAULT_USERNAME,
      passwordHash: envPasswordHash
    }
  }

  // Tentar ler do arquivo (apenas em desenvolvimento/local)
  if (existsSync(configFilePath)) {
    try {
      const content = await readFile(configFilePath, 'utf-8')
      const data = JSON.parse(content)
      
      // Se tem passwordHash (formato bcrypt ou SHA-256), usar ele
      if (data.passwordHash) {
        return {
          username: data.username || DEFAULT_USERNAME,
          passwordHash: data.passwordHash
        }
      }
      // Se tem password (formato antigo), criar hash bcrypt e migrar
      else if (data.password) {
        const passwordHash = await bcrypt.hash(data.password, 10)
        // Retornar hash
        return {
          username: data.username || DEFAULT_USERNAME,
          passwordHash: passwordHash
        }
      }
    } catch (error) {
      console.error('Erro ao ler configuração de autenticação:', error)
    }
  }
  
  // Se não existe arquivo e não tem hash em cache, criar hash bcrypt da senha padrão
  // Usar cache para evitar recalcular toda vez (importante no Vercel)
  if (!cachedPasswordHash) {
    cachedPasswordHash = await bcrypt.hash(DEFAULT_PASSWORD, 10)
  }
  
  return {
    username: DEFAULT_USERNAME,
    passwordHash: cachedPasswordHash
  }
}

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json(
        { success: false, error: 'Usuário e senha são obrigatórios' },
        { status: 400 }
      )
    }

    // Verificar rate limiting por IP
    const clientIp = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown'
    
    const rateLimit = checkRateLimit(clientIp)
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Muitas tentativas. Tente novamente em ${Math.ceil((rateLimit.retryAfter || 0) / 60)} minutos.`,
          retryAfter: rateLimit.retryAfter
        },
        { status: 429 }
      )
    }

    const credentials = await getCredentials()

    // Verificar username
    if (username !== credentials.username) {
      recordFailedAttempt(clientIp)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuário ou senha incorretos',
          remainingAttempts: rateLimit.remainingAttempts - 1
        },
        { status: 401 }
      )
    }

    // Verificar senha usando bcrypt
    const passwordMatch = await bcrypt.compare(password, credentials.passwordHash)
    
    if (!passwordMatch) {
      recordFailedAttempt(clientIp)
      return NextResponse.json(
        { 
          success: false, 
          error: 'Usuário ou senha incorretos',
          remainingAttempts: rateLimit.remainingAttempts - 1
        },
        { status: 401 }
      )
    }

    // Login bem-sucedido - limpar tentativas e gerar token JWT
    clearAttempts(clientIp)
    const authToken = generateToken(username)
    
    const response = NextResponse.json({ 
      success: true,
      message: 'Login realizado com sucesso'
    })

    // Definir cookie de autenticação (válido por 7 dias)
    response.cookies.set('auth-token', authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 dias
      path: '/',
    })

    return response
  } catch (error: any) {
    console.error('Erro ao fazer login:', error)
    // Log mais detalhado para debug
    if (error.message) {
      console.error('Mensagem de erro:', error.message)
    }
    if (error.stack) {
      console.error('Stack trace:', error.stack)
    }
    return NextResponse.json(
      { 
        success: false, 
        error: process.env.NODE_ENV === 'production' 
          ? 'Erro ao processar login' 
          : `Erro ao processar login: ${error.message || 'Erro desconhecido'}`
      },
      { status: 500 }
    )
  }
}
