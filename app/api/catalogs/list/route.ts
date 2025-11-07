import { NextRequest, NextResponse } from 'next/server'
import { readdir, stat } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { verifyAuth } from '@/lib/auth'

const catalogsDir = path.join(process.cwd(), 'public', 'catalogs')

// GET lista todos os arquivos HTML de catálogos
export async function GET(request: NextRequest) {
  const auth = verifyAuth(request)
  if (!auth.authenticated) {
    return auth.response || NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
  }

  try {
    if (!existsSync(catalogsDir)) {
      return NextResponse.json({ files: [] })
    }

    const files = await readdir(catalogsDir)
    const htmlFiles = files.filter(file => file.endsWith('.html'))

    const filesWithStats = await Promise.all(
      htmlFiles.map(async (file) => {
        const filePath = path.join(catalogsDir, file)
        const stats = await stat(filePath)
        const link = file.replace('.html', '')
        
        return {
          filename: file,
          link: link,
          createdAt: stats.birthtime.toISOString(),
          modifiedAt: stats.mtime.toISOString(),
          size: stats.size
        }
      })
    )

    // Ordenar por data de criação (mais recente primeiro)
    filesWithStats.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    return NextResponse.json({ files: filesWithStats })
  } catch (error: any) {
    console.error('Erro ao listar catálogos HTML:', error)
    return NextResponse.json(
      { error: `Erro ao listar catálogos: ${error.message}` },
      { status: 500 }
    )
  }
}

// DELETE remove um arquivo HTML específico
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

    const htmlFilePath = path.join(catalogsDir, `${link}.html`)
    
    if (!existsSync(htmlFilePath)) {
      return NextResponse.json(
        { error: 'Arquivo HTML não encontrado' },
        { status: 404 }
      )
    }

    const { unlink } = await import('fs/promises')
    await unlink(htmlFilePath)

    return NextResponse.json({ 
      success: true, 
      message: 'Arquivo HTML removido com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao remover arquivo HTML:', error)
    return NextResponse.json(
      { error: `Erro ao remover arquivo: ${error.message}` },
      { status: 500 }
    )
  }
}

