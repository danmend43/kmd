import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import crypto from 'crypto'
import { verifyAuth } from '@/lib/auth'

const configFilePath = path.join(process.cwd(), 'public', 'catalog-config.json')

// GET é público (usado pela página de catálogo pública)
export async function GET() {
  try {
    if (!existsSync(configFilePath)) {
      return NextResponse.json({ catalogs: [] })
    }

    const content = await readFile(configFilePath, 'utf-8')
    const data = JSON.parse(content)
    
    // Remover catálogos expirados automaticamente
    const now = new Date()
    const activeCatalogs = (data.catalogs || []).filter((cat: any) => {
      if (cat.expiresAt) {
        return new Date(cat.expiresAt) > now
      }
      return true
    })
    
    // Se houve remoção de expirados, salvar arquivo atualizado
    if (activeCatalogs.length !== (data.catalogs || []).length) {
      const configDir = path.dirname(configFilePath)
      if (!existsSync(configDir)) {
        await mkdir(configDir, { recursive: true })
      }
      await writeFile(configFilePath, JSON.stringify({ catalogs: activeCatalogs }, null, 2), 'utf-8')
    }
    
    return NextResponse.json({ catalogs: activeCatalogs })
  } catch (error: any) {
    console.error('Erro ao carregar configurações:', error)
    return NextResponse.json(
      { error: `Erro ao carregar configurações: ${error.message}` },
      { status: 500 }
    )
  }
}

// POST requer autenticação (apenas admin pode criar catálogos)
export async function POST(request: NextRequest) {
  const auth = verifyAuth(request)
  if (!auth.authenticated) {
    return auth.response || NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const { expirationMinutes, name, selectedGroups } = await request.json()

    if (!expirationMinutes) {
      return NextResponse.json(
        { error: 'Tempo de expiração é obrigatório' },
        { status: 400 }
      )
    }

    const catalogName = name || 'Contas do Kwai'

    // Gerar link aleatório
    const randomLink = crypto.randomBytes(16).toString('hex')
    
    // Carregar catálogos existentes para verificar números
    let catalogs = []
    if (existsSync(configFilePath)) {
      const content = await readFile(configFilePath, 'utf-8')
      const data = JSON.parse(content)
      catalogs = data.catalogs || []
    }

    // Gerar número aleatório único que nunca se repete
    let randomNumber: string
    let isUnique = false
    
    while (!isUnique) {
      // Gerar número aleatório de 6 dígitos
      randomNumber = Math.floor(100000 + Math.random() * 900000).toString()
      
      // Verificar se já existe
      const now = new Date()
      const activeCatalogs = catalogs.filter((cat: any) => {
        if (cat.expiresAt) {
          return new Date(cat.expiresAt) > now
        }
        return true
      })
      
      isUnique = !activeCatalogs.some((cat: any) => cat.number === randomNumber)
    }
    
    // Calcular timestamp de expiração
    const expiresAt = new Date(Date.now() + expirationMinutes * 60000).toISOString()

    const catalog = {
      link: randomLink,
      number: randomNumber!,
      name: catalogName,
      expirationMinutes,
      expiresAt,
      createdAt: new Date().toISOString(),
      active: true,
      selectedGroups: selectedGroups || [] // Grupos selecionados
    }

    // Remover catálogos expirados antes de adicionar
    const now = new Date()
    catalogs = catalogs.filter((cat: any) => {
      if (cat.expiresAt) {
        return new Date(cat.expiresAt) > now
      }
      return true
    })

    // Adicionar novo catálogo
    catalogs.push(catalog)

    const configDir = path.dirname(configFilePath)
    if (!existsSync(configDir)) {
      await mkdir(configDir, { recursive: true })
    }

    await writeFile(configFilePath, JSON.stringify({ catalogs }, null, 2), 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: 'Catálogo criado com sucesso',
      catalog
    })
  } catch (error: any) {
    console.error('Erro ao salvar configuração:', error)
    return NextResponse.json(
      { error: `Erro ao salvar configuração: ${error.message}` },
      { status: 500 }
    )
  }
}

// DELETE requer autenticação (apenas admin pode deletar catálogos)
export async function DELETE(request: NextRequest) {
  const auth = verifyAuth(request)
  if (!auth.authenticated) {
    return auth.response || NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    const { link } = await request.json()

    if (!link) {
      return NextResponse.json(
        { error: 'Link é obrigatório' },
        { status: 400 }
      )
    }

    let catalogs = []
    if (existsSync(configFilePath)) {
      const content = await readFile(configFilePath, 'utf-8')
      const data = JSON.parse(content)
      catalogs = data.catalogs || []
    }

    catalogs = catalogs.filter((cat: any) => cat.link !== link)

    const configDir = path.dirname(configFilePath)
    if (!existsSync(configDir)) {
      await mkdir(configDir, { recursive: true })
    }

    await writeFile(configFilePath, JSON.stringify({ catalogs }, null, 2), 'utf-8')

    return NextResponse.json({ 
      success: true, 
      message: 'Catálogo removido com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao remover catálogo:', error)
    return NextResponse.json(
      { error: `Erro ao remover catálogo: ${error.message}` },
      { status: 500 }
    )
  }
}

