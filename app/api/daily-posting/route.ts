import { NextRequest, NextResponse } from 'next/server'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { existsSync } from 'fs'
import path from 'path'
import { verifyAuth } from '@/lib/auth'

const postingFilePath = path.join(process.cwd(), 'public', 'daily-posting.json')
const postingHistoryPath = path.join(process.cwd(), 'public', 'daily-posting-history.json')

// Função para obter a data atual no formato YYYY-MM-DD usando timezone local do servidor
function getTodayDate(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export async function GET(request: NextRequest) {
  const auth = verifyAuth(request)
  if (!auth.authenticated) {
    return auth.response!
  }
  try {
    let postingData = {}
    let history = []

    if (existsSync(postingFilePath)) {
      const content = await readFile(postingFilePath, 'utf-8')
      const data = JSON.parse(content)
      postingData = data.postingData || {}
    }

    if (existsSync(postingHistoryPath)) {
      const historyContent = await readFile(postingHistoryPath, 'utf-8')
      const historyData = JSON.parse(historyContent)
      history = historyData.history || []
    }
    
    return NextResponse.json({ postingData, history })
  } catch (error: any) {
    console.error('Erro ao carregar postagens do dia:', error)
    return NextResponse.json(
      { error: `Erro ao carregar postagens: ${error.message}` },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  const auth = verifyAuth(request)
  if (!auth.authenticated) {
    return auth.response!
  }

  try {
    const { postingData, addToHistory, removeFromHistory } = await request.json()

    if (removeFromHistory !== undefined) {
      // Remover do histórico
      let history = []
      if (existsSync(postingHistoryPath)) {
        const historyContent = await readFile(postingHistoryPath, 'utf-8')
        const historyData = JSON.parse(historyContent)
        history = historyData.history || []
      }
      
      history = history.filter((item: any, index: number) => index !== removeFromHistory)
      
      const historyDir = path.dirname(postingHistoryPath)
      if (!existsSync(historyDir)) {
        await mkdir(historyDir, { recursive: true })
      }
      
      await writeFile(postingHistoryPath, JSON.stringify({ history }, null, 2), 'utf-8')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Item removido do histórico'
      })
    }

    let historyEntry = null

    // Processar addToHistory primeiro (se existir)
    if (addToHistory) {
      // Adicionar ao histórico quando completar
      let history = []
      if (existsSync(postingHistoryPath)) {
        const historyContent = await readFile(postingHistoryPath, 'utf-8')
        const historyData = JSON.parse(historyContent)
        history = historyData.history || []
      }
      
      // Sempre usar a data atual do servidor (timezone local) para evitar problemas
      const now = new Date()
      const todayDate = getTodayDate() // Formato YYYY-MM-DD baseado no timezone local
      
      // Criar objeto de histórico com a data atual do servidor
      historyEntry = {
        date: todayDate, // Sempre usar data atual do servidor (timezone local)
        startTime: addToHistory.startTime || now.toISOString(),
        endTime: addToHistory.endTime || now.toISOString(),
        totalAccounts: addToHistory.totalAccounts || 0,
        selectedGroup: addToHistory.selectedGroup || undefined
      }
      
      history.unshift(historyEntry)
      
      const historyDir = path.dirname(postingHistoryPath)
      if (!existsSync(historyDir)) {
        await mkdir(historyDir, { recursive: true })
      }
      
      await writeFile(postingHistoryPath, JSON.stringify({ history }, null, 2), 'utf-8')
    }

    // Processar postingData (se existir)
    if (postingData) {
      const postingDir = path.dirname(postingFilePath)
      if (!existsSync(postingDir)) {
        await mkdir(postingDir, { recursive: true })
      }

      const data = {
        postingData,
        lastUpdated: new Date().toISOString()
      }

      await writeFile(postingFilePath, JSON.stringify(data, null, 2), 'utf-8')
    }

    // Retornar resposta incluindo historyEntry se foi criado
    const response: any = { 
      success: true, 
      message: 'Dados salvos com sucesso'
    }
    
    if (historyEntry) {
      response.historyEntry = historyEntry
    }

    return NextResponse.json(response)
  } catch (error: any) {
    console.error('Erro ao salvar postagens:', error)
    return NextResponse.json(
      { error: `Erro ao salvar postagens: ${error.message}` },
      { status: 500 }
    )
  }
}

