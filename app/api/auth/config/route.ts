import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import bcrypt from 'bcrypt'
import { verifyAuth } from '@/lib/auth'

// Salvar fora da pasta public por segurança
const configFilePath = path.join(process.cwd(), 'auth-config.json')

// Valores padrão - usar variáveis de ambiente se disponíveis
const DEFAULT_USERNAME = process.env.DEFAULT_AUTH_USERNAME || 'danmend'
const DEFAULT_PASSWORD = process.env.DEFAULT_AUTH_PASSWORD || '202022'

// Carregar configuração de autenticação
export async function GET(request: NextRequest) {
  const auth = verifyAuth(request)
  if (!auth.authenticated) {
    return auth.response!
  }

  try {
    let username = DEFAULT_USERNAME
    let password = '' // Senha nunca é retornada, apenas o username

    if (existsSync(configFilePath)) {
      const content = await readFile(configFilePath, 'utf-8')
      const data = JSON.parse(content)
      username = data.username || DEFAULT_USERNAME
      // Não retornar a senha, apenas indicar que existe
    }

    return NextResponse.json({ 
      username,
      hasPassword: true // Sempre retorna true, mas não retorna a senha real
    })
  } catch (error: any) {
    console.error('Erro ao carregar configuração:', error)
    // Em caso de erro, retornar valores padrão
    return NextResponse.json({ 
      username: DEFAULT_USERNAME,
      hasPassword: true
    })
  }
}

// Atualizar configuração de autenticação
export async function POST(request: NextRequest) {
  const auth = verifyAuth(request)
  if (!auth.authenticated) {
    return auth.response!
  }

  try {
    const { username, password } = await request.json()

    if (!username || username.trim() === '') {
      return NextResponse.json(
        { error: 'Username é obrigatório' },
        { status: 400 }
      )
    }

    if (!password || password.trim() === '') {
      return NextResponse.json(
        { error: 'Senha é obrigatória' },
        { status: 400 }
      )
    }

    // Criar diretório se não existir
    const configDir = path.dirname(configFilePath)
    if (!existsSync(configDir)) {
      await mkdir(configDir, { recursive: true })
    }

    // Criar hash da senha usando bcrypt (mais seguro)
    const passwordHash = await bcrypt.hash(password.trim(), 10)

    const data = {
      username: username.trim(),
      passwordHash: passwordHash, // Salvar hash bcrypt ao invés da senha em texto plano
      lastUpdated: new Date().toISOString()
    }

    await writeFile(configFilePath, JSON.stringify(data, null, 2), 'utf-8')

    return NextResponse.json({ 
      success: true,
      message: 'Configurações atualizadas com sucesso',
      username: data.username
    })
  } catch (error: any) {
    console.error('Erro ao salvar configuração:', error)
    return NextResponse.json(
      { error: `Erro ao salvar configuração: ${error.message}` },
      { status: 500 }
    )
  }
}
