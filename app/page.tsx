'use client'

import { useState, useEffect, useRef } from 'react'
import ProfileCard from '@/components/ProfileCard'
import CalendarComponent from '@/components/CalendarComponent'

// Função para limpar o nome, removendo " (@username) on Kwai"
const cleanDisplayName = (name: string): string => {
  if (!name) return ''
  // Remove padrões como " (@username) on Kwai"
  return name.replace(/\s*\(@[^)]+\)\s*on\s+Kwai\s*$/i, '').trim()
}

interface ProfileData {
  username: string
  displayName: string
  avatar: string
  followers: string
  likes: string
  bio: string
  verified: boolean
  url: string
  email?: string
  password?: string
  name?: string
  sequence?: number
}

interface AccountData {
  id?: string
  email: string
  password: string
  name?: string
  number?: string
  cel?: string
  url?: string
}

const defaultUrls = [
  'https://k.kwai.com/u/@sonicrockeiro/CtsFOYGe',
  'https://k.kwai.com/u/@denos887/CkIucBsM',
  'https://k.kwai.com/u/@ttailss/wshiC0Yp',
  'https://k.kwai.com/u/@crafa495/tXCUibtR',
  'https://k.kwai.com/u/@evfeb293/bstC8nm3',
  'https://k.kwai.com/u/@leofood680/HuM8Csok',
  'https://k.kwai.com/u/@spideria/z9wxCPWx',
  'https://k.kwai.com/u/@spiderman014/2KzOsCvR',
  'https://k.kwai.com/u/@sonicia543/XNuCUX4z',
  'https://k.kwai.com/u/@pokemonia/FJCEtIqj',
  'https://k.kwai.com/u/@sonic263/9FIVtCK2',
  'https://k.kwai.com/u/@danielmend766/3wCyqXoF',
  'https://k.kwai.com/u/@subra552/z7EZquCl',
  'https://k.kwai.com/u/@subra735/1wwCWefi',
  'https://k.kwai.com/u/@hfhjbgj/j6uGFuCG',
  'https://k.kwai.com/u/@hfnvk/HuNG6ZC2',
  'https://k.kwai.com/u/@myclerobert752/eax7CCwP',
  'https://k.kwai.com/u/@myclerobert117/UuWCIIvL',
  'https://k.kwai.com/u/@myclerobert031/uC1Y4Tk4',
  'https://k.kwai.com/u/@farabi853/wNkyeTCh',
  'https://k.kwai.com/u/@meyun863/CPuta9cC',
  'https://k.kwai.com/u/@milonahmedkobi/CwoMxUgc',
  'https://k.kwai.com/u/@milonahmedkala/lBtvpJCL',
  'https://k.kwai.com/u/@tamimahmed253/GRCv2if0',
  'https://k.kwai.com/u/@foysal978/bQmnVvCh',
  'https://k.kwai.com/u/@ranaahmedshuvo790/fCwiConC',
  'https://k.kwai.com/u/@emonahmedbappi/FCs8kSMM',
  'https://k.kwai.com/u/@tamimahmednaim/tFC9DT2g',
  'https://k.kwai.com/u/@ranaahmednaim/zwuNlCv8',
  'https://k.kwai.com/u/@firozaheadmasu/toZrACmS',
  'https://k.kwai.com/u/@tamimahmedmahi/tjQHJ0Cc',
  'https://k.kwai.com/u/@sabbirahmedmaf/vMpvyCeG',
  'https://k.kwai.com/u/@bajiyahmedshuv/L3ubrCvx',
  'https://k.kwai.com/u/@bajiyahmedbapp/CwFNrvHp',
  'https://k.kwai.com/u/@lemonahmed134/Dhu0cC3q',
  'https://k.kwai.com/u/@kingestonedmon/hNuCQgfT',
  'https://k.kwai.com/u/@laurabrooklynn204/5uCQtpAN',
  'https://k.kwai.com/u/@maevparkinson/7CCvLgdR',
  'https://k.kwai.com/u/@albertocalvinz/nv1wC3Wf',
  'https://k.kwai.com/u/@lilia845/CUePGjv5',
  'https://k.kwai.com/u/@myclerobert/lBCB5LtH',
  'https://k.kwai.com/u/@nicksantos761/TCaSAw8O',
  'https://k.kwai.com/u/@mkzimsantsnder/CzCmudUC',
  'https://k.kwai.com/u/@jansenfloor/cVsCZCD3',
  'https://k.kwai.com/u/@floorjansen/2esChvzz',
  'https://k.kwai.com/u/@bvxydhcx/rgK6WvCJ',
  'https://k.kwai.com/u/@gsfvxkvgkb/rQswQ6C6',
  'https://k.kwai.com/u/@mbcyfanbxd/vRxJvzCw',
  'https://k.kwai.com/u/@bvxfssiyfkbc/WswwCUFa',
  'https://k.kwai.com/u/@mbcjhgjjczf/eCwf4lCM',
  'https://k.kwai.com/u/@jvjnsshwmvs/dcCsL1ce',
  'https://k.kwai.com/u/@nhkvsujvks/sS9iCru4',
  'https://k.kwai.com/u/@dert834/CoaFvAaq',
  'https://k.kwai.com/u/@idcqp088/yGuMCZU1',
  'https://k.kwai.com/u/@lvdok089/wt78CaIT',
  'https://kwai-video.com/u/@efuzm973/kvLgwvCl',
  'https://k.kwai.com/u/@kaik820/C2tAyPxk',
  'https://k.kwai.com/u/@marc656/lterHCbP',
  'https://k.kwai.com/u/@veig543/5uCKCYsX',
  'https://k.kwai.com/u/@xeig256/snC8flJA',
  'https://k.kwai.com/u/@sand174/TpqCSt6f',
  'https://k.kwai.com/u/@gelio068/hGjspCuK',
  'https://k.kwai.com/u/@lira167/CeA1Ewsu',
  'https://k.kwai.com/u/@dxkio885/CuRyIkP6',
  'https://k.kwai.com/u/@pqvho150/KsCsasbF',
  'https://k.kwai.com/u/@ztori021/Crkaup8N',
  'https://k.kwai.com/u/@luddds/bCvtRTeI',
]

const accountData = [
  { email: 'sonicrockeiro@gmail.com', password: 'kwai202022', name: 'sonicrockeiro', followers: '4.5K', verified: true },
  { email: 'd9161258@gmail.com', password: 'kwai202022', name: 'denos', followers: '3.1K', verified: true },
  { email: 'ttailss488@gmail.com', password: 'kwai202022', name: 'Ttailss', followers: '3.3K', verified: true },
  { email: 'crafa1387@gmail.com', password: 'kwai202022', name: 'crafa', followers: '3.1K', verified: true },
  { email: 'd60025523@gmail.com', password: 'kwai202022', name: 'daniel', followers: '3.4K', verified: true },
  { email: 'animationiajt@gmail.com', password: 'kwai202022', name: 'leoedit', followers: '6.5K', verified: true },
  { email: 'spideria63@gmail.com', password: 'kwai202022', name: 'spideria', followers: '3.3K', verified: true },
  { email: 'spider776m@gmail.com', password: 'kwai202022', name: 'Spiderman', followers: '3.4K', verified: true },
  { email: 'sonicia786@gmail.com', password: 'kwai202022', name: 'sonicia', followers: '3.3K', verified: true },
  { email: 'pokemonia72@gmail.com', password: 'kwai202022', name: 'Pokemonia', followers: '3.4K', verified: true },
  { email: 's40382900@gmail.com', password: 'kwai202022', name: 'Sonics4', followers: '3.3K', verified: true },
  { email: 'danielmendggmax@gmail.com', password: 'kwai202022', name: 'danielmend', followers: '3.2K', verified: true },
  { email: 'ssss01082088@gmail.com', password: 'kwai202022', name: 'subra', followers: '2.5K', verified: true },
  { email: 'ssss01082090@gmail.com', password: 'kwai202022', name: 'olv', followers: '2.5K', verified: true },
  { email: 'imran9999190@gmail.com', password: 'kwai202022', name: 'vitt', followers: '2.3K', verified: true },
  { email: 'head6262183@gmail.com', password: 'kwai202022', name: 'hawk', followers: '2.4K', verified: true },
  { email: 'mukta122040@gmail.com', password: 'kwai202022', name: 'myclerobert752', followers: '2.5K', verified: true },
  { email: 'mukta122041@gmail.com', password: 'kwai202022', name: 'mecst', followers: '2.2K', verified: true },
  { email: 'azim122040@gmail.com', password: 'kwai202022', name: 'ellen', followers: '2.4K', verified: true },
  { email: 'farabifk5555@gmail.com', password: 'kwai202022', name: 'farabi', followers: '2.4K', verified: true },
  { email: 'skfarukyt2524@gmail.com', password: 'kwai202022', name: 'faruk', followers: '1.8K', verified: true },
  { email: 'milonahmedkobir59@gmail.com', password: 'kwai202022', name: 'milon', followers: '1.8K', verified: true },
  { email: 'milonahmedkalam5@gmail.com', password: 'kwai202022', name: 'kalam', followers: '2.1K', verified: true },
  { email: 'tamimahmedsj21@gmail.com', password: 'kwai202022', name: 'tamim', followers: '1.9K', verified: true },
  { email: 'foysalahmedgoal18@gmail.com', password: 'kwai202022', name: 'foysal', followers: '2K', verified: true },
  { email: 'ranaahmedshuvo59@gmail.com', password: 'kwai202022', name: 'Rana', followers: '2K', verified: true },
  { email: 'emonahmedbappi44@gmail.com', password: 'kwai202022', name: 'Emon', followers: '2.1K', verified: true },
  { email: 'tamimahmednaim92@gmail.com', password: 'kwai202022', name: 'Naim', followers: '1.9K', verified: true },
  { email: 'ranaahmednaim@gmail.com', password: 'kwai202022', name: 'tyla', followers: '1.8K', verified: true },
  { email: 'firozaheadmasud@gmail.com', password: 'kwai202022', name: 'Firoz', followers: '1.9K', verified: true },
  { email: 'tamimahmedmahim5@gmail.com', password: 'kwai202022', name: 'med77', followers: '2K', verified: true },
  { email: 'sabbirahmedmafuz01@gmail.com', password: 'kwai202022', name: 'SABRI', followers: '1.8K', verified: true },
  { email: 'bajiyahmedshuvo@gmail.com', password: 'kwai202022', name: 'Bajiy', followers: '2K', verified: true },
  { email: 'bajiyahmedbappi@gmail.com', password: 'kwai202022', name: 'Bappi', followers: '1.8K', verified: true },
  { email: 'lemonahmedhcjyd@gmail.com', password: 'kwai202022', name: 'Lemon', followers: '2.2K', verified: true },
  { email: 'kingestonedmond@gmail.com', password: 'kwai202022', name: 'edmond', followers: '2K', verified: true },
  { email: 'brooklynnlaura99@gmail.com', password: 'kwai202022', name: 'laura', followers: '1.8K', verified: true },
  { email: 'maevparkinson@gmail.com', password: 'kwai202022', name: 'Maev', followers: '1.8K', verified: true },
  { email: 'albertocalvinzion@gmail.com', password: 'kwai202022', name: 'Zion', followers: '2K', verified: true },
  { email: 'ssss01082089@gmail.com', password: 'kwai202022', name: 'lilia', followers: '1.7K', verified: true },
  { email: 'rima122040@gmail.com', password: 'kwai202022', name: 'myclerobert', followers: '1.7K', verified: true },
  { email: 'nicksantos9615@gmail.com', password: 'kwai202022', name: 'Nick Santos', followers: '1.1K', verified: true },
  { email: 'mkzimsantsnder@gmail.com', password: 'kwai202022', name: 'Mkzim Santsnder', followers: '1.2K', verified: true },
  { email: 'mnvcwmhe927829@gmail.com', password: 'kwai202022', name: 'Jansen Floor', followers: '1.1K', verified: true },
  { email: 'mnvxsawri75432@gmail.com', password: 'kwai202022', name: 'Floor Jansen', followers: '1.1K', verified: true },
  { email: 'dhcxbvxy@gmail.com', password: 'kwai202022', name: 'Bvxy Dhcx', followers: '1.1K', verified: true },
  { email: 'gsfvxkvgkb@gmail.com', password: 'kwai202022', name: 'Gsfvx Kvgkb', followers: '1.2K', verified: true },
  { email: 'anbxdmbcyf@gmail.com', password: 'kwai202022', name: 'Mbcyf Anbxd', followers: '1.1K', verified: true },
  { email: 'bvxfssiyfkbc@gmail.com', password: 'kwai202022', name: 'Bvxfss Iyfkbc', followers: '1.1K', verified: true },
  { email: 'gjjczfmbcjh@gmail.com', password: 'kwai202022', name: 'Mbcjh Gjjczf', followers: '1.2K', verified: true },
  { email: 'jvjnsshwmvs@gmail.com', password: 'kwai202022', name: 'Jvjnss Hwmvs', followers: '791', verified: true },
  { email: 'ujvksnhkvs@gmail.com', password: 'kwai202022', name: 'Nhkvs Ujvks', followers: '1.2K', verified: true },
  { email: 'ifeel314@ponp.be', password: 'kwai202022', name: 'dert', followers: '1.3K', verified: false },
  { email: 'diplievow237@fuwamofu.com', password: 'kwai202022', name: 'regis', followers: '1K', verified: false },
  { email: 'piewas285@instaddr.uk', password: 'kwai202022', name: 'kelly', followers: '856', verified: false },
  { email: 'rugmudpep@svk.jp', password: 'kwai202022', name: 'lorena', followers: '1.2K', verified: false },
  { email: 'hipohdig@fuwamofu.com', password: 'kwai202022', name: 'kaik', followers: '1.3K', verified: false },
  { email: 'ourwoonow@owleyes.ch', password: 'kwai202022', name: 'marc', followers: '1.1K', verified: false },
  { email: 'gumhimlap@nanana.uk', password: 'kwai202022', name: 'veig', followers: '1.1K', verified: false },
  { email: 'rubuse75@instaddr.win', password: 'kwai202022', name: 'xeig', followers: '1.2K', verified: false },
  { email: 'captagbee@risu.be', password: 'kwai202022', name: 'sand', followers: '1.2K', verified: false },
  { email: 'gofaraim@ponp.be', password: 'kwai202022', name: 'gelio', followers: '1.2K', verified: false },
  { email: 'lierawfog@merry.pink', password: 'kwai202022', name: 'lira', followers: '1.1K', verified: false },
  { email: 'newjobrot@f5.si', password: 'kwai202022', name: 'july', followers: '1.3K', verified: false },
  { email: 'bugsue337@svk.jp', password: 'kwai202022', name: 'rena', followers: '1.2K', verified: false },
  { email: 'viaplyshe@exdonuts.com', password: 'kwai202022', name: 'nando', followers: '1.2K', verified: false },
  { email: 'mopnotrot@meruado.uk', password: 'kwai202022', name: 'ludds', followers: '1.1K', verified: false },
]

export default function Home() {
  // Garantir que as URLs estejam sempre atualizadas
  const [urls, setUrls] = useState<string[]>(() => {
    // Sempre usar as URLs padrão atualizadas
    const updatedUrls = defaultUrls.map(url => {
      // Atualizar URLs antigas para os formatos corretos
      if (url.includes('www.kwai.com/@efuzm973')) {
        return 'https://kwai-video.com/u/@efuzm973/kvLgwvCl'
      }
      if (url.includes('www.kwai.com/@kaik820')) {
        return 'https://k.kwai.com/u/@kaik820/C2tAyPxk'
      }
      return url
    })
    return updatedUrls
  })
  
  // Atualizar URLs quando componente montar para garantir correção
  useEffect(() => {
    setUrls(prevUrls => {
      const updated = prevUrls.map(url => {
        if (url.includes('www.kwai.com/@efuzm973')) {
          return 'https://kwai-video.com/u/@efuzm973/kvLgwvCl'
        }
        if (url.includes('www.kwai.com/@kaik820')) {
          return 'https://k.kwai.com/u/@kaik820/C2tAyPxk'
        }
        return url
      })
      return updated
    })
  }, [])
  const [profiles, setProfiles] = useState<ProfileData[]>([])
  const [loading, setLoading] = useState(false)
  const [progress, setProgress] = useState({ current: 0, total: 0 })
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'dashboard' | 'followers' | 'accounts' | 'urls' | 'history' | 'calendar' | 'groups' | 'postagem' | 'catalog-config' | 'config'>('dashboard')
  const [catalogConfig, setCatalogConfig] = useState({ 
    expirationMinutes: null as number | null,
    selectedGroups: [] as string[]
  })
  const [catalogLink, setCatalogLink] = useState<string>('')
  const [catalogs, setCatalogs] = useState<Array<{ link: string, number: string, name: string, expirationMinutes: number, expiresAt: string, createdAt: string, active: boolean }>>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [dailyPostingGroup, setDailyPostingGroup] = useState<string | null>(null) // Grupo selecionado na postagem do dia
  const [dailyPosting, setDailyPosting] = useState<{ [key: string]: { selected: string[], startTime?: string, endTime?: string, completed?: boolean, selectedGroup?: string } }>({})
  const [postingHistory, setPostingHistory] = useState<Array<{ date: string, startTime: string, endTime: string, totalAccounts: number, selectedGroup?: string }>>([])
  const [sequences, setSequences] = useState<{ [key: string]: number }>({})
  const [markedDays, setMarkedDays] = useState<{ [key: string]: boolean }>({})
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [editingUrlIndex, setEditingUrlIndex] = useState<number | null>(null)
  const [editingUrl, setEditingUrl] = useState<string>('')
  const [newUrl, setNewUrl] = useState<string>('')
  const [showAddAccount, setShowAddAccount] = useState(false)
  const [newAccount, setNewAccount] = useState({
    id: '',
    email: '',
    password: '',
    url: '',
    number: '',
    cel: ''
  })
  const [historyFiles, setHistoryFiles] = useState<Array<{filename: string, date: string}>>([])
  const [selectedHistory, setSelectedHistory] = useState<string>('')
  const [historyProfiles, setHistoryProfiles] = useState<ProfileData[]>([])
  const [accounts, setAccounts] = useState<AccountData[]>([])
  const [editingAccountIndex, setEditingAccountIndex] = useState<number | null>(null)

  // Salvar URLs no arquivo
  const saveUrls = async (urlsToSave: string[]) => {
    try {
      const response = await fetch('/api/urls', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ urls: urlsToSave }),
      })
      if (response.ok) {
        console.log('URLs salvas com sucesso')
      }
    } catch (e) {
      console.error('Erro ao salvar URLs:', e)
    }
  }

  // Carregar última análise do histórico ao iniciar
  useEffect(() => {
    const loadLastHistory = async () => {
      try {
        const response = await fetch('/api/load-last-history')
        if (response.ok) {
          const data = await response.json()
          if (data.profiles && data.profiles.length > 0) {
            // Limpar nomes removendo " (@username) on Kwai"
            const cleanedProfiles = data.profiles.map((p: any) => ({
              ...p,
              name: cleanDisplayName(p.name || ''),
              displayName: cleanDisplayName(p.displayName || p.name || '')
            }))
            setProfiles(cleanedProfiles)
            console.log('Perfis carregados do histórico:', cleanedProfiles.length)
            
            // Sincronizar contas com os perfis do histórico (será feito quando contas estiverem carregadas)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar último histórico:', e)
      }
    }

    loadLastHistory()

    // Carregar sequências do localStorage (apenas para sequência de dias)
    const savedSequences = localStorage.getItem('sequences')
    if (savedSequences) {
      try {
        setSequences(JSON.parse(savedSequences))
      } catch (e) {
        console.error('Erro ao carregar sequências:', e)
      }
    }

    // Carregar dados do calendário
    const loadCalendarData = async () => {
      try {
        const response = await fetch('/api/calendar')
        if (response.ok) {
          const data = await response.json()
          if (data.markedDays) {
            setMarkedDays(data.markedDays)
          }
          if (data.sequences) {
            // Usar sequências do calendário como fonte principal
            setSequences(data.sequences)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar calendário:', e)
      }
    }

    loadCalendarData()

    // Carregar URLs salvas
    const loadSavedUrls = async () => {
      try {
        const response = await fetch('/api/urls')
        if (response.ok) {
          const data = await response.json()
          if (data.urls && data.urls.length > 0) {
            setUrls(data.urls)
            console.log('URLs carregadas do arquivo:', data.urls.length)
          } else {
            // Se não há URLs salvas, salvar as padrão
            const initialUrls = defaultUrls.map(url => {
              if (url.includes('www.kwai.com/@efuzm973')) {
                return 'https://kwai-video.com/u/@efuzm973/kvLgwvCl'
              }
              if (url.includes('www.kwai.com/@kaik820')) {
                return 'https://k.kwai.com/u/@kaik820/C2tAyPxk'
              }
              return url
            })
            setUrls(initialUrls)
            saveUrls(initialUrls)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar URLs:', e)
      }
    }

    loadSavedUrls()

    // Carregar lista de históricos
    const loadHistoryFiles = async () => {
      try {
        const response = await fetch('/api/history/list')
        if (response.ok) {
          const data = await response.json()
          if (data.files && data.files.length > 0) {
            setHistoryFiles(data.files)
            // Por padrão, selecionar o mais recente
            setSelectedHistory(data.files[0].filename)
            // Carregar dados do histórico mais recente
            loadHistoryData(data.files[0].filename)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar arquivos de histórico:', e)
      }
    }

    loadHistoryFiles()

    // Carregar contas salvas
    const loadAccounts = async () => {
      try {
        const response = await fetch('/api/accounts')
        if (response.ok) {
          const data = await response.json()
          if (data.accounts && data.accounts.length > 0) {
            // Gerar IDs numéricos únicos para contas que não têm
            const existingIds = new Set<string>()
            const accountsWithIds = data.accounts.map((acc: AccountData) => {
              if (acc.id) {
                existingIds.add(acc.id)
                return acc
              }
              return acc
            })
            
            // Gerar IDs no formato kw+numero (kw1, kw2, kw3...) para contas sem ID, garantindo que sejam únicos
            let counter = 1
            const finalAccounts = accountsWithIds.map((acc: AccountData) => {
              if (!acc.id || acc.id.trim() === '') {
                let newId = ''
                do {
                  newId = `kw${counter}`
                  counter++
                } while (existingIds.has(newId))
                
                existingIds.add(newId)
                return { ...acc, id: newId }
              }
              return acc
            })
            
            setAccounts(finalAccounts)
            
            // Se alguma conta teve ID gerado, salvar
            const needsSave = data.accounts.some((acc: AccountData) => !acc.id || acc.id.trim() === '')
            if (needsSave) {
              try {
                await fetch('/api/accounts', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ accounts: finalAccounts }),
                })
                console.log('IDs gerados e salvos com sucesso')
              } catch (e) {
                console.error('Erro ao salvar IDs:', e)
              }
            }
          } else {
            // Se não há contas salvas, usar as padrão com IDs no formato kw+numero
            const accountsWithIds = accountData.map((acc, index) => ({
              ...acc,
              id: `kw${index + 1}`
            }))
            setAccounts(accountsWithIds)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar contas:', e)
        // Em caso de erro, usar as padrão com IDs no formato kw+numero
        const accountsWithIds = accountData.map((acc, index) => ({
          ...acc,
          id: `kw${index + 1}`
        }))
        setAccounts(accountsWithIds)
      }
    }

    loadAccounts()

    const loadDailyPosting = async () => {
      try {
        const response = await fetch('/api/daily-posting')
        if (response.ok) {
          const data = await response.json()
          if (data.postingData) {
            setDailyPosting(data.postingData)
            // Restaurar o grupo selecionado do dia atual
            const today = new Date().toISOString().split('T')[0]
            const todayData = data.postingData[today]
            
          }
          if (data.history) {
            setPostingHistory(data.history)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar postagens do dia:', e)
      }
    }

    loadDailyPosting()

    const loadCatalogConfigs = async () => {
      try {
        const response = await fetch('/api/catalog-config')
        if (response.ok) {
          const data = await response.json()
          if (data.catalogs) {
            // Filtrar apenas catálogos não expirados
            const now = new Date()
            const activeCatalogs = data.catalogs.filter((cat: any) => {
              if (cat.expiresAt) {
                return new Date(cat.expiresAt) > now
              }
              return true
            })
            setCatalogs(activeCatalogs)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar configurações de catálogo:', e)
      }
    }

    loadCatalogConfigs()
  }, [])

  // Sincronizar contas quando perfis estiverem disponíveis e contas já carregadas
  const hasSyncedRef = useRef(false)
  useEffect(() => {
    if (accounts.length > 0 && profiles.length > 0 && !hasSyncedRef.current) {
      syncAccountsWithProfiles(profiles).then(() => {
        hasSyncedRef.current = true
      })
    }
  }, [accounts.length, profiles.length])
  
  // Sincronizar quando histórico de perfis for carregado
  const hasSyncedHistoryRef = useRef<string>('')
  useEffect(() => {
    if (accounts.length > 0 && historyProfiles.length > 0 && selectedHistory && selectedHistory !== hasSyncedHistoryRef.current) {
      syncAccountsWithProfiles(historyProfiles).then(() => {
        hasSyncedHistoryRef.current = selectedHistory
      })
    }
  }, [accounts.length, historyProfiles.length, selectedHistory])

  // Função para sincronizar contas com perfis (atualizar nomes e fotos)
  const syncAccountsWithProfiles = async (profilesData: ProfileData[]) => {
    if (!profilesData || profilesData.length === 0 || accounts.length === 0) return
    
    let updatedAccounts = [...accounts]
    let hasUpdates = false
    
    for (const profile of profilesData) {
      if (!profile.email && !profile.url) continue
      
      // Buscar conta correspondente - múltiplas estratégias
      let accountIndex = -1
      
      // Estratégia 1: Match por email exato
      if (profile.email) {
        accountIndex = updatedAccounts.findIndex(acc => 
          acc.email.toLowerCase() === profile.email!.toLowerCase()
        )
      }
      
      // Estratégia 2: Match por URL
      if (accountIndex === -1 && profile.url) {
        const urlNormalized = profile.url.split('?')[0].toLowerCase()
        accountIndex = updatedAccounts.findIndex(acc => {
          if (!acc.url) return false
          const accUrlNormalized = acc.url.split('?')[0].toLowerCase()
          return accUrlNormalized === urlNormalized
        })
      }
      
      // Estratégia 3: Match por username da URL com email
      if (accountIndex === -1 && profile.url) {
        const usernameMatch = profile.url.match(/@([^\/\?]+)/)
        const username = usernameMatch ? usernameMatch[1].toLowerCase() : ''
        if (username) {
          accountIndex = updatedAccounts.findIndex(acc => {
            const accEmail = acc.email.toLowerCase()
            const emailUsername = accEmail.split('@')[0]
            return emailUsername === username || accEmail.includes(username)
          })
        }
      }
      
      // Atualizar conta se encontrou e tem dados válidos
      if (accountIndex >= 0) {
        const extractedName = cleanDisplayName(profile.displayName || profile.name || profile.username || '')
        if (extractedName && extractedName !== '' && extractedName !== 'n/a') {
          const currentName = updatedAccounts[accountIndex].name || ''
          if (currentName === 'n/a' || currentName === '' || currentName !== extractedName) {
            updatedAccounts[accountIndex] = {
              ...updatedAccounts[accountIndex],
              name: extractedName
            }
            hasUpdates = true
            console.log(`✅ Conta sincronizada: ${updatedAccounts[accountIndex].email} -> Nome: ${extractedName.trim()}`)
          }
        }
      }
    }
    
    // Salvar atualizações se houver
    if (hasUpdates) {
      setAccounts(updatedAccounts)
      try {
        await fetch('/api/accounts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accounts: updatedAccounts }),
        })
        console.log('✅ Contas sincronizadas com histórico')
      } catch (e) {
        console.error('Erro ao salvar contas sincronizadas:', e)
      }
    }
  }

  // Carregar dados de um histórico específico
  const loadHistoryData = async (filename: string) => {
    try {
      const response = await fetch(`/api/history/load?filename=${encodeURIComponent(filename)}`)
      if (response.ok) {
        const data = await response.json()
        if (data.profiles) {
          // Converter para formato ProfileData
          const formattedProfiles: ProfileData[] = data.profiles.map((p: any) => {
            const cleanedName = cleanDisplayName(p.name || '')
            return {
              url: p.url || '',
              email: p.email || '',
              password: '',
              username: p.username || '',
              name: cleanedName,
              displayName: cleanedName,
              avatar: p.avatar || '',
              followers: p.followers || '',
              likes: p.likes || '',
              bio: '',
              verified: p.verified || false,
              sequence: 0
            }
          })
          setHistoryProfiles(formattedProfiles)
          
          // A sincronização será feita pelo useEffect quando historyProfiles mudar
        }
      }
    } catch (e) {
      console.error('Erro ao carregar dados do histórico:', e)
    }
  }

  // Quando o histórico selecionado mudar, carregar os dados
  useEffect(() => {
    if (selectedHistory) {
      loadHistoryData(selectedHistory)
    }
  }, [selectedHistory])

  // Função para converter seguidores em número
  const parseFollowers = (followersStr: string): number => {
    if (!followersStr || followersStr === 'N/A' || followersStr === '0') return 0
    
    // Remover caracteres não numéricos exceto ponto e vírgula
    const cleaned = followersStr.replace(/[^\d.,KkMmBb]/g, '')
    
    // Se contém K, M ou B
    if (cleaned.toLowerCase().includes('k')) {
      const num = parseFloat(cleaned.replace(/[kK]/g, '').replace(',', '.'))
      return Math.floor(num * 1000)
    }
    if (cleaned.toLowerCase().includes('m')) {
      const num = parseFloat(cleaned.replace(/[mM]/g, '').replace(',', '.'))
      return Math.floor(num * 1000000)
    }
    if (cleaned.toLowerCase().includes('b')) {
      const num = parseFloat(cleaned.replace(/[bB]/g, '').replace(',', '.'))
      return Math.floor(num * 1000000000)
    }
    
    // Se é apenas número
    return parseInt(cleaned.replace(/[^\d]/g, '') || '0')
  }

  // Função para determinar o grupo de uma conta baseado nos seguidores
  const getGroupName = (followers: number): string => {
    if (followers < 1000) return 'inicio'
    const groupK = Math.floor(followers / 1000)
    return `${groupK}k`
  }

  // Estado para dados atualizados dos grupos
  const [groupsProfiles, setGroupsProfiles] = useState<ProfileData[]>([])

  // Carregar dados atualizados quando a aba de grupos é aberta
  useEffect(() => {
    const loadLatestHistory = async () => {
      if (activeTab === 'groups') {
        try {
          const response = await fetch('/api/load-last-history')
          if (response.ok) {
            const data = await response.json()
            if (data.profiles && data.profiles.length > 0) {
              setGroupsProfiles(data.profiles)
            }
          }
        } catch (e) {
          console.error('Erro ao carregar histórico para grupos:', e)
        }
      }
    }
    
    loadLatestHistory()
  }, [activeTab])

  // Agrupar contas por faixa de seguidores
  const groupedAccounts = (): { [key: string]: ProfileData[] } => {
    // Prioridade: groupsProfiles (mais atualizado) > historyProfiles > profiles
    const dataToUse = groupsProfiles.length > 0 
      ? groupsProfiles 
      : (historyProfiles.length > 0 ? historyProfiles : profiles)
    const groups: { [key: string]: ProfileData[] } = {}
    
    dataToUse.forEach(profile => {
      const followersNum = parseFollowers(profile.followers || '0')
      const groupName = getGroupName(followersNum)
      
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(profile)
    })
    
    return groups
  }


  // Atualizar sequências do calendário quando mudar
  useEffect(() => {
    const updateCalendarSequences = async () => {
      try {
        const response = await fetch('/api/calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            markedDays,
            sequences
          }),
        })
        if (response.ok) {
          console.log('Sequências do calendário atualizadas')
        }
      } catch (e) {
        console.error('Erro ao atualizar sequências:', e)
      }
    }

    // Atualizar apenas se sequences mudou e não é o carregamento inicial
    if (Object.keys(sequences).length > 0) {
      updateCalendarSequences()
    }
  }, [sequences, markedDays])

  // Adicionar nova URL
  const handleAddUrl = () => {
    if (!newUrl.trim()) {
      setError('URL não pode estar vazia')
      return
    }
    const updatedUrls = [...urls, newUrl.trim()]
    setUrls(updatedUrls)
    setNewUrl('')
    saveUrls(updatedUrls)
    setError(null)
  }

  // Editar URL
  const handleStartEdit = (index: number) => {
    setEditingUrlIndex(index)
    setEditingUrl(urls[index])
  }

  const handleSaveEdit = () => {
    if (editingUrlIndex === null || !editingUrl.trim()) {
      setError('URL não pode estar vazia')
      return
    }
    const updatedUrls = [...urls]
    updatedUrls[editingUrlIndex] = editingUrl.trim()
    setUrls(updatedUrls)
    setEditingUrlIndex(null)
    setEditingUrl('')
    saveUrls(updatedUrls)
    setError(null)
  }

  const handleCancelEdit = () => {
    setEditingUrlIndex(null)
    setEditingUrl('')
  }

  // Remover URL e também da conta correspondente
  const handleRemoveUrl = (index: number) => {
    const urlToRemove = urls[index]
    
    // Extrair username da URL
    const usernameMatch = urlToRemove.match(/@([^\/\?]+)/)
    const username = usernameMatch ? usernameMatch[1].toLowerCase() : ''
    
    // Remover da lista de URLs
    const updatedUrls = urls.filter((_, i) => i !== index)
    setUrls(updatedUrls)
    saveUrls(updatedUrls)
    
    // Remover perfis relacionados dessa URL
    setProfiles(profiles.filter(p => p.url !== urlToRemove))
    
    console.log(`URL removida: ${urlToRemove}`)
  }

  const handleExecute = async () => {
    if (urls.length === 0) {
      setError('Adicione pelo menos uma URL')
      return
    }

    setLoading(true)
    setError(null)
    setProfiles([])
    setProgress({ current: 0, total: urls.length })

    const results: ProfileData[] = []
    const errors: string[] = []
    const executionData: any[] = []

    for (let i = 0; i < urls.length; i++) {
      const url = urls[i].trim()
      if (!url) continue

      setProgress({ current: i + 1, total: urls.length })

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })

        const data = await response.json()

        if (!response.ok) {
          errors.push(`${url}: ${data.error || 'Erro ao analisar'}`)
          continue
        }

                // Buscar dados da conta correspondente (das contas cadastradas)
                const usernameMatch = url.match(/@([^\/\?]+)/)
                const username = usernameMatch ? usernameMatch[1].toLowerCase() : ''
                
                // Buscar nas contas cadastradas - múltiplas estratégias
                let account = null
                
                // Estratégia 1: Match por URL exata (mais confiável)
                account = accounts.find(acc => acc.url && acc.url.toLowerCase() === url.toLowerCase())
                
                // Estratégia 2: Match por URL normalizada (sem query params)
                if (!account) {
                  const urlNormalized = url.split('?')[0].toLowerCase()
                  account = accounts.find(acc => {
                    if (!acc.url) return false
                    const accUrlNormalized = acc.url.split('?')[0].toLowerCase()
                    return accUrlNormalized === urlNormalized
                  })
                }
                
                // Estratégia 3: Match por username extraído da URL com email
                if (!account && username) {
                  account = accounts.find(acc => {
                    const accEmail = acc.email.toLowerCase()
                    const emailUsername = accEmail.split('@')[0]
                    return emailUsername === username || accEmail.includes(username)
                  })
                }
                
                // Se encontrou a conta, atualizar com o nome e foto buscados
                if (account) {
                  const accountIndex = accounts.findIndex(acc => 
                    acc.id === account.id || 
                    acc.email === account.email ||
                    (acc.url && account.url && acc.url === account.url)
                  )
                  
                  if (accountIndex >= 0) {
                    const updatedAccounts = [...accounts]
                    const extractedName = cleanDisplayName(data.displayName || data.username || '')
                    const extractedAvatar = data.avatar || data.profileImage || ''
                    
                    // Só atualizar se houver dados extraídos válidos
                    if (extractedName && extractedName !== '') {
                      updatedAccounts[accountIndex] = {
                        ...updatedAccounts[accountIndex],
                        name: extractedName
                      }
                      setAccounts(updatedAccounts)
                      
                      // Salvar no arquivo
                      try {
                        await fetch('/api/accounts', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ accounts: updatedAccounts }),
                        })
                        console.log(`✅ Conta atualizada: ${account.email} -> Nome: ${extractedName}`)
                      } catch (e) {
                        console.error('Erro ao atualizar conta:', e)
                      }
                    }
                  }
                } else {
                  console.warn(`⚠️ Conta não encontrada para URL: ${url}`)
                }

        // Validar dados antes de adicionar
        if (!data.followers || data.followers === 'N/A' || data.followers === '0' || data.followers === '') {
          console.warn(`⚠️ [${url}] Seguidores inválidos: ${data.followers}`)
        }
        if (!data.likes || data.likes === 'N/A' || data.likes === '0' || data.likes === '') {
          console.warn(`⚠️ [${url}] Curtidas inválidas: ${data.likes}`)
        }

                const profile: ProfileData = {
                  ...data,
                  url,
                  email: account?.email || '',
                  password: account?.password || '',
                  name: account?.name || cleanDisplayName(data.displayName || data.username || ''),
                  sequence: sequences['global'] || 0
                }

        // Se não tem dados válidos, adicionar aos erros mas não bloquear
        if ((!profile.followers || profile.followers === 'N/A' || profile.followers === '0') &&
            (!profile.likes || profile.likes === 'N/A' || profile.likes === '0')) {
          errors.push(`${url}: Dados não encontrados (Seguidores: ${profile.followers}, Curtidas: ${profile.likes})`)
        }

        results.push(profile)
        executionData.push({
          url,
          email: profile.email,
          name: profile.name,
          username: profile.username,
          avatar: profile.avatar,
          followers: profile.followers,
          likes: profile.likes,
          verified: profile.verified
        })
        
        const updatedProfiles = [...results]
        setProfiles(updatedProfiles)
      } catch (err: any) {
        errors.push(`${url}: ${err.message || 'Erro ao analisar'}`)
      }

      // Pausa maior entre requisições para evitar sobrecarga e dar tempo para carregar
      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Salvar histórico em arquivo (sempre que houver resultados)
    if (executionData.length > 0) {
      try {
        console.log(`💾 Salvando histórico com ${executionData.length} perfis...`)
        const response = await fetch('/api/save-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: executionData }),
        })
        
        if (response.ok) {
          const result = await response.json()
          console.log('✅ Histórico salvo com sucesso:', result.filename || result.message)
          
          // Atualizar dados dos grupos imediatamente após salvar
          if (results.length > 0) {
            setGroupsProfiles(results)
          }
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Erro desconhecido' }))
          console.error('❌ Erro ao salvar histórico:', errorData.error || 'Erro desconhecido')
        }
      } catch (e: any) {
        console.error('❌ Erro ao salvar histórico:', e.message || e)
      }
    } else {
      console.warn('⚠️ Nenhum dado para salvar no histórico')
    }

    if (errors.length > 0 && results.length === 0) {
      setError(`Erros encontrados: ${errors.slice(0, 3).join(', ')}`)
    }

    setLoading(false)
    setProgress({ current: 0, total: 0 })
  }

  const handleCheckSequence = async (url: string) => {
    if (typeof window === 'undefined') return
    
    const today = new Date().toISOString().split('T')[0]
    const lastCheck = localStorage.getItem(`check_${url}`)
    
    if (lastCheck !== today) {
      // Marcar o dia no calendário
      const newMarkedDays = { ...markedDays, [today]: true }
      setMarkedDays(newMarkedDays)
      
      // Calcular nova sequência global do calendário
      const sortedDates = Object.keys(newMarkedDays)
        .filter(key => newMarkedDays[key])
        .map(key => new Date(key + 'T00:00:00'))
        .sort((a, b) => b.getTime() - a.getTime()) // Mais recente primeiro
      
      let newSequence = 0
      if (sortedDates.length > 0) {
        newSequence = 1
        for (let i = 0; i < sortedDates.length - 1; i++) {
          const currentDate = sortedDates[i]
          const nextDate = sortedDates[i + 1]
          const diffTime = currentDate.getTime() - nextDate.getTime()
          const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
          
          if (diffDays === 1) {
            newSequence++
          } else {
            break
          }
        }
      }
      
      const newSequences = { ...sequences, 'global': newSequence }
      setSequences(newSequences)
      
      localStorage.setItem(`check_${url}`, today)
      
      // Atualizar perfis com nova sequência
      const updatedProfiles = profiles.map(p => 
        p.url === url ? { ...p, sequence: newSequence } : p
      )
      setProfiles(updatedProfiles)
      
      // Salvar no calendário
      try {
        await fetch('/api/calendar', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            markedDays: newMarkedDays,
            sequences: newSequences
          }),
        })
      } catch (e) {
        console.error('Erro ao salvar calendário:', e)
      }
    }
  }

  // Função para verificar se um perfil tem dados inválidos
  const hasInvalidData = (profile: ProfileData): boolean => {
    const followersInvalid = !profile.followers || 
                            profile.followers === 'N/A' || 
                            profile.followers === '0' || 
                            profile.followers === '' ||
                            parseInt(profile.followers.replace(/[^\d]/g, '')) === 0
    
    const likesInvalid = !profile.likes || 
                        profile.likes === 'N/A' || 
                        profile.likes === '0' || 
                        profile.likes === '' ||
                        parseInt(profile.likes.replace(/[^\d]/g, '')) === 0
    
    return followersInvalid || likesInvalid
  }

  // Contar perfis inválidos
  const invalidProfilesCount = profiles.filter(p => hasInvalidData(p)).length

  // Função para verificar apenas perfis inválidos
  const handleVerifyInvalid = async () => {
    const invalidProfiles = profiles.filter(p => hasInvalidData(p) && p.url)
    
    if (invalidProfiles.length === 0) {
      setError('Nenhum perfil com dados inválidos encontrado')
      return
    }

    setLoading(true)
    setError(null)
    setProgress({ current: 0, total: invalidProfiles.length })

    const updatedProfiles = [...profiles]
    const errors: string[] = []
    const executionData: any[] = []

    for (let i = 0; i < invalidProfiles.length; i++) {
      const profile = invalidProfiles[i]
      const url = profile.url || ''

      if (!url) continue

      setProgress({ current: i + 1, total: invalidProfiles.length })

      try {
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ url }),
        })

        const data = await response.json()

        if (!response.ok) {
          errors.push(`${url}: ${data.error || 'Erro ao analisar'}`)
          continue
        }

        // Buscar dados da conta correspondente
        const usernameMatch = url.match(/@([^\/\?]+)/)
        const username = usernameMatch ? usernameMatch[1].toLowerCase() : ''
        
        let account = accountData.find(acc => {
          const accName = acc.name.toLowerCase()
          const accEmail = acc.email.toLowerCase()
          return accName === username || 
                 accEmail.includes(username) ||
                 username.includes(accName.split(' ')[0]) ||
                 accEmail.split('@')[0].includes(username)
        })
        
        if (!account) {
          // Tentar encontrar pelo email do perfil atual
          account = accountData.find(acc => acc.email === profile.email)
        }

        // Atualizar o perfil na lista
        const profileIndex = updatedProfiles.findIndex(p => p.url === url)
        if (profileIndex >= 0) {
                  updatedProfiles[profileIndex] = {
                    ...data,
                    url,
                    email: account?.email || profile.email || '',
                    password: account?.password || profile.password || '',
                    name: account?.name || cleanDisplayName(data.displayName || data.username || profile.name || ''),
                    sequence: sequences['global'] || 0
                  }
        }

        executionData.push({
          url,
          email: updatedProfiles[profileIndex]?.email || '',
          name: updatedProfiles[profileIndex]?.name || '',
          username: data.username || '',
          avatar: data.avatar || '',
          followers: data.followers || '',
          likes: data.likes || '',
          verified: data.verified || false
        })

        setProfiles([...updatedProfiles])
      } catch (err: any) {
        errors.push(`${url}: ${err.message || 'Erro ao analisar'}`)
      }

      await new Promise(resolve => setTimeout(resolve, 2000))
    }

    // Atualizar histórico com os novos dados
    if (executionData.length > 0) {
      try {
        // Carregar histórico atual e mesclar com novos dados
        const allProfilesForHistory = updatedProfiles.map(p => ({
          url: p.url || '',
          email: p.email || '',
          name: p.name || '',
          username: p.username || '',
          avatar: p.avatar || '',
          followers: p.followers || '',
          likes: p.likes || '',
          verified: p.verified || false
        }))

        const response = await fetch('/api/save-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ data: allProfilesForHistory }),
        })

        if (response.ok) {
          console.log('Histórico atualizado com sucesso')
        }
      } catch (e) {
        console.error('Erro ao atualizar histórico:', e)
      }
    }

    if (errors.length > 0) {
      setError(`Alguns erros ocorreram: ${errors.slice(0, 3).join(', ')}`)
    }

    setLoading(false)
    setProgress({ current: 0, total: 0 })
  }

  // Função para fazer logout
  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      })
      // Redirecionar para a página de login
      window.location.href = '/login'
    } catch (error) {
      console.error('Erro ao fazer logout:', error)
      // Mesmo com erro, redirecionar para login
      window.location.href = '/login'
    }
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header Novo */}
      <header className="header-new">
        <div className="flex items-center justify-between max-w-[1920px] mx-auto">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
              K
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Gerenciador Kwai</h1>
              <p className="text-xs text-slate-500">Sistema de Gestão</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="btn-new btn-secondary-new"
          >
            <span>🚪</span>
            <span>Sair</span>
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar Nova */}
        <aside className="sidebar-new hidden lg:block">
          <nav>
            {[
              { id: 'dashboard', label: 'Dashboard', icon: '📊' },
              { id: 'accounts', label: 'Contas', icon: '🔐' },
              { id: 'urls', label: 'URLs', icon: '🔗' },
              { id: 'history', label: 'Histórico', icon: '📝' },
              { id: 'calendar', label: 'Calendário', icon: '📅' },
              { id: 'groups', label: 'Grupos', icon: '👥' },
              { id: 'postagem', label: 'Postagem do Dia', icon: '📄' },
              { id: 'catalog-config', label: 'Configurar Catálogo', icon: '🎨' },
              { id: 'config', label: 'Config', icon: '⚙️' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`sidebar-item-new ${activeTab === tab.id ? 'active' : ''}`}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main Content Novo */}
        <main className="flex-1 min-h-screen">
          <div className="main-container animate-fade-in">
            {/* Dashboard Tab */}
            {activeTab === 'dashboard' && (
              <>
                <div className="card-new mb-8">
                  <h2 className="title-section mb-6">📊 Dashboard</h2>
                  
                  <div className="flex flex-wrap items-center gap-3 mb-6">
                    <span className="badge-new badge-blue">
                      URLs: <strong>{urls.length}</strong>
                    </span>
                    {profiles.length > 0 && (
                      <span className="badge-new badge-purple">
                        Perfis: <strong>{profiles.length}</strong>
                      </span>
                    )}
                    {invalidProfilesCount > 0 && (
                      <span className="badge-new badge-red">
                        Inválidos: <strong>{invalidProfilesCount}</strong>
                      </span>
                    )}
                  </div>

                  {loading && (
                    <div className="mb-6">
                      <div className="flex items-center gap-3 mb-3 text-slate-600">
                        <div className="spinner-new"></div>
                        <span className="font-medium">Processando...</span>
                        <span className="font-bold text-blue-600">
                          {progress.current}/{progress.total}
                        </span>
                      </div>
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${(progress.current / progress.total) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                      <p className="text-red-700 text-sm">{error}</p>
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={handleExecute}
                      disabled={loading || urls.length === 0}
                      className="btn-new btn-primary-new disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {loading ? (
                        <>
                          <div className="spinner-new"></div>
                          <span>Processando... {progress.current}/{progress.total}</span>
                        </>
                      ) : (
                        <>
                          <span>🚀</span>
                          <span>Executar Análise</span>
                        </>
                      )}
                    </button>
                    {invalidProfilesCount > 0 && (
                      <button
                        onClick={handleVerifyInvalid}
                        disabled={loading}
                        className="btn-new btn-danger-new disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>⚠️</span>
                        <span>Verificar Inválidos ({invalidProfilesCount})</span>
                      </button>
                    )}
                  </div>
                </div>

                {profiles.length > 0 && (
                  <div className="mb-8">
                    <h3 className="title-section">📈 Estatísticas Gerais</h3>
                    <div className="stats-grid">
                      <div className="stat-card">
                        <div className="stat-value">{profiles.length}</div>
                        <div className="stat-label">Perfis Analisados</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">
                          {profiles.reduce((sum, p) => sum + (parseInt(p.followers.replace(/[^\d]/g, '')) || 0), 0).toLocaleString()}
                        </div>
                        <div className="stat-label">Total Seguidores</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">
                          {profiles.reduce((sum, p) => sum + (parseInt(p.likes.replace(/[^\d]/g, '')) || 0), 0).toLocaleString()}
                        </div>
                        <div className="stat-label">Total Curtidas</div>
                      </div>
                      <div className="stat-card">
                        <div className="stat-value">
                          {(() => {
                            const sortedDates = Object.keys(markedDays)
                              .filter(key => markedDays[key])
                              .map(key => new Date(key + 'T00:00:00'))
                              .sort((a, b) => b.getTime() - a.getTime())
                            
                            if (sortedDates.length === 0) return 0

                            let sequence = 1
                            for (let i = 0; i < sortedDates.length - 1; i++) {
                              const currentDate = sortedDates[i]
                              const nextDate = sortedDates[i + 1]
                              const diffTime = currentDate.getTime() - nextDate.getTime()
                              const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
                              
                              if (diffDays === 1) {
                                sequence++
                              } else {
                                break
                              }
                            }
                            return sequence
                          })()}
                        </div>
                        <div className="stat-label">Dias Consecutivos</div>
                      </div>
                    </div>
                  </div>
                )}

                {profiles.length > 0 && (
                  <div className="card-new">
                    <h2 className="title-section">👥 Perfis Analisados ({profiles.length})</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                      {profiles.map((profile, index) => {
                        // Atualizar sequência do perfil com a sequência global do calendário
                        const profileWithSequence = {
                          ...profile,
                          sequence: sequences['global'] || 0
                        }
                        return (
                          <ProfileCard 
                            key={index} 
                            profileData={profileWithSequence}
                            onCheckSequence={() => handleCheckSequence(profile.url)}
                          />
                        )
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* Followers Tab - REMOVIDO */}
            {false && activeTab === 'followers' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">👥 Seguidores</h2>
                  <div className="flex gap-3">
                    <select
                      value={selectedHistory}
                      onChange={(e) => setSelectedHistory(e.target.value)}
                      className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm"
                    >
                      {historyFiles.map((file) => (
                        <option key={file.filename} value={file.filename}>
                          {file.date}
                        </option>
                      ))}
                    </select>
                    <button
                      onClick={handleExecute}
                      disabled={loading || urls.length === 0}
                      className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      🔄 Atualizar Dados
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Foto</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Seguidores</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Curtidas</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Verificado</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Sequência</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historyProfiles.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                            Nenhum dado disponível. Selecione um histórico ou execute a análise primeiro.
                          </td>
                        </tr>
                      ) : (
                        historyProfiles.map((profile, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className="px-4 py-3">
                              {(() => {
                                const cleanName = cleanDisplayName(profile.name || profile.displayName || profile.username || '')
                                return profile.avatar ? (
                                  <img
                                    src={profile.avatar}
                                    alt={cleanName}
                                    className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-purple-400 flex items-center justify-center">
                                    <span className="text-xs text-purple-600 font-bold">
                                      {(cleanName || '?')[0]?.toUpperCase()}
                                    </span>
                                  </div>
                                )
                              })()}
                            </td>
                            <td className="px-4 py-3">
                              <div>
                                <div className="font-semibold text-gray-900">
                                  {cleanDisplayName(profile.name || profile.displayName || profile.username || '')}
                                </div>
                                {profile.username && (
                                  <div className="text-xs text-gray-500">@{profile.username}</div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                              {profile.followers || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm font-semibold text-gray-700">
                              {profile.likes || 'N/A'}
                            </td>
                            <td className="px-4 py-3 text-sm">
                              {profile.verified ? (
                                <span className="text-green-600 font-semibold">✓ SIM</span>
                              ) : (
                                <span className="text-gray-400">:) Não</span>
                              )}
                            </td>
                            <td className="px-4 py-3">
                              <span className="text-sm font-semibold text-purple-600">
                                {sequences['global'] || sequences[profile.url || ''] || 0} dias
                              </span>
                            </td>
                            <td className="px-4 py-3 text-sm">
                              <button
                                onClick={() => handleCheckSequence(profile.url || '')}
                                disabled={typeof window !== 'undefined' && localStorage.getItem(`check_${profile.url}`) === new Date().toISOString().split('T')[0]}
                                className="px-3 py-1 bg-blue-500 text-white rounded-md text-xs hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {typeof window !== 'undefined' && localStorage.getItem(`check_${profile.url}`) === new Date().toISOString().split('T')[0] ? '✓ Hoje' : '+1 Dia'}
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Accounts Tab */}
            {activeTab === 'accounts' && (
              <div className="card-new">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6">
                  <h2 className="title-section">🔐 Contas</h2>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => setShowAddAccount(true)}
                      className="btn-new btn-success-new"
                    >
                      <span>➕</span>
                      <span>Adicionar Conta</span>
                    </button>
                    <button
                      onClick={handleExecute}
                      disabled={loading || urls.length === 0}
                      className="btn-new btn-primary-new disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span>🔄</span>
                      <span>Atualizar Dados</span>
                    </button>
                  </div>
                </div>

                {/* Modal de Adicionar Conta */}
                {showAddAccount && (
                  <div className="modal-overlay">
                    <div className="modal-content">
                      <h3 className="title-section mb-6">
                        {editingAccountIndex !== null ? '✏️ Editar Conta' : '➕ Adicionar Nova Conta'}
                      </h3>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Email *</label>
                          <input
                            type="email"
                            value={newAccount.email}
                            onChange={(e) => setNewAccount({ ...newAccount, email: e.target.value })}
                            className="input-new"
                            placeholder="exemplo@gmail.com"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Senha *</label>
                          <input
                            type="text"
                            value={newAccount.password}
                            onChange={(e) => setNewAccount({ ...newAccount, password: e.target.value })}
                            className="input-new"
                            placeholder="senha123"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Link do Kwai *</label>
                          <input
                            type="text"
                            value={newAccount.url}
                            onChange={(e) => setNewAccount({ ...newAccount, url: e.target.value })}
                            className="input-new font-mono text-sm"
                            placeholder="https://k.kwai.com/u/@username/..."
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Número (opcional)</label>
                          <input
                            type="text"
                            value={newAccount.number}
                            onChange={(e) => setNewAccount({ ...newAccount, number: e.target.value })}
                            className="input-new"
                            placeholder="Ex: 5511999999999"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Cel (opcional)</label>
                          <select
                            value={newAccount.cel}
                            onChange={(e) => setNewAccount({ ...newAccount, cel: e.target.value })}
                            className="input-new"
                          >
                            <option value="">Sem celular</option>
                            {Array.from({ length: 500 }, (_, i) => i + 1).map((num) => (
                              <option key={num} value={`Cel ${num}`}>
                                Cel {num}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={async () => {
                            if (!newAccount.email || !newAccount.password || !newAccount.url) {
                              setError('Preencha todos os campos obrigatórios')
                              return
                            }
                            
                            // Gerar ID automaticamente por incremento numérico
                            let finalId = ''
                            if (editingAccountIndex === null) {
                              // Nova conta - gerar ID por incremento
                              const existingIds = accounts
                                .map(acc => acc.id)
                                .filter((id): id is string => {
                                  if (!id) return false
                                  return /^\d+$/.test(id)
                                }) // Apenas IDs numéricos
                                .map(id => parseInt(id, 10))
                              
                              if (existingIds.length > 0) {
                                const maxId = Math.max(...existingIds)
                                finalId = String(maxId + 1)
                              } else {
                                finalId = '1'
                              }
                            } else {
                              // Editando conta - manter o ID existente
                              finalId = accounts[editingAccountIndex].id || ''
                            }
                            
                            // Processar cel - se vazio, salvar como "n/a"
                            const celValue = newAccount.cel && newAccount.cel.trim() !== '' ? newAccount.cel : 'n/a'
                            
                            // Criar objeto da conta - nome inicia como "n/a" para novas contas
                            const existingAccount = editingAccountIndex !== null ? accounts[editingAccountIndex] : null
                            const accountToSave: AccountData = {
                              ...newAccount,
                              id: finalId,
                              cel: celValue,
                              name: editingAccountIndex === null 
                                ? 'n/a' 
                                : (existingAccount?.name || 'n/a')
                            }
                            
                            if (editingAccountIndex !== null) {
                              // Editar conta existente
                              const oldAccount = accounts[editingAccountIndex]
                              const updatedAccounts = [...accounts]
                              
                              // Se a URL mudou, atualizar na lista de URLs
                              if (oldAccount.url && oldAccount.url !== newAccount.url) {
                                // Remover URL antiga
                                const updatedUrls = urls.filter(url => url !== oldAccount.url)
                                // Adicionar nova URL se não existir
                                if (!updatedUrls.includes(newAccount.url)) {
                                  updatedUrls.push(newAccount.url)
                                }
                                setUrls(updatedUrls)
                                await saveUrls(updatedUrls)
                              }
                              
                              updatedAccounts[editingAccountIndex] = accountToSave
                              setAccounts(updatedAccounts)
                              setEditingAccountIndex(null)
                              
                              // Salvar no arquivo
                              try {
                                await fetch('/api/accounts', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ accounts: updatedAccounts }),
                                })
                              } catch (e) {
                                console.error('Erro ao salvar conta:', e)
                              }
                            } else {
                              // Nova conta - adicionar URL na lista de URLs
                              if (!urls.includes(newAccount.url)) {
                                const updatedUrls = [...urls, newAccount.url]
                                setUrls(updatedUrls)
                                await saveUrls(updatedUrls)
                              }
                              
                              // Adicionar conta (nome inicia como "n/a" - será preenchido na análise)
                              // Salvar a URL no objeto da conta para poder remover depois
                              const updatedAccounts = [...accounts, accountToSave]
                              setAccounts(updatedAccounts)
                              
                              // Salvar no arquivo
                              try {
                                await fetch('/api/accounts', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ accounts: updatedAccounts }),
                                })
                              } catch (e) {
                                console.error('Erro ao salvar conta:', e)
                              }
                            }
                            
                            setNewAccount({ id: '', email: '', password: '', url: '', number: '', cel: '' })
                            setShowAddAccount(false)
                            setError(null)
                          }}
                          className="btn-new btn-success-new flex-1"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setShowAddAccount(false)
                            setEditingAccountIndex(null)
                            setNewAccount({ id: '', email: '', password: '', url: '', number: '', cel: '' })
                            setError(null)
                          }}
                          className="btn-new btn-secondary-new flex-1"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">ID</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Senha</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nome</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Cel</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                            Nenhuma conta cadastrada. Clique em "Adicionar Conta" para começar.
                          </td>
                        </tr>
                      ) : (
                        accounts.map((account, index) => {
                          const copyNumber = () => {
                            if (account.number) {
                              navigator.clipboard.writeText(account.number)
                              const btn = document.getElementById(`copy-btn-${index}`)
                              if (btn) {
                                btn.textContent = '✓ Copiado!'
                                setTimeout(() => {
                                  btn.textContent = '🔗'
                                }, 2000)
                              }
                            }
                          }

                          const handleRemoveAccount = async () => {
                            if (confirm(`Tem certeza que deseja remover esta conta?\n${account.email}`)) {
                              const updatedAccounts = accounts.filter((_, i) => i !== index)
                              setAccounts(updatedAccounts)
                              
                              // Remover URL correspondente - buscar pela URL salva ou gerar pelo email
                              let urlToRemove = account.url
                              
                              // Se não tem URL salva, tentar gerar pelo email
                              if (!urlToRemove) {
                                const emailUsername = account.email.split('@')[0]
                                urlToRemove = `https://k.kwai.com/u/@${emailUsername}`
                              }
                              
                              // Remover da lista de URLs
                              const updatedUrls = urls.filter(url => {
                                // Verificar se é exatamente a URL ou se corresponde ao email
                                if (url === urlToRemove) return false
                                
                                // Verificar se a URL contém o username do email
                                const emailUsername = account.email.split('@')[0]
                                const urlUsername = url.match(/@([^\/\?]+)/)?.[1]?.toLowerCase()
                                if (urlUsername === emailUsername.toLowerCase()) return false
                                
                                return true
                              })
                              
                              // Se removeu alguma URL, atualizar a lista
                              if (updatedUrls.length < urls.length) {
                                setUrls(updatedUrls)
                                await saveUrls(updatedUrls)
                              }
                              
                              // Salvar contas
                              try {
                                await fetch('/api/accounts', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ accounts: updatedAccounts }),
                                })
                              } catch (e) {
                                console.error('Erro ao salvar contas:', e)
                              }
                            }
                          }

                          return (
                            <tr key={index} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3 text-sm text-gray-700 font-bold font-mono">
                                {account.id || '-'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">
                                <span>{account.email}</span>
                                {account.number && (
                                  <button
                                    id={`copy-btn-${index}`}
                                    onClick={copyNumber}
                                    className="text-purple-600 hover:text-purple-800 cursor-pointer transition-colors ml-2"
                                    title={`Copiar número: ${account.number}`}
                                  >
                                    🔗
                                  </button>
                                )}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700 font-mono">{account.password}</td>
                              <td className="px-4 py-3 text-sm text-gray-700 font-semibold">
                                {account.name || 'N/A'}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-700">{account.cel || 'N/A'}</td>
                              <td className="px-4 py-3 text-sm">
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingAccountIndex(index)
                                      setNewAccount({
                                        id: account.id || '',
                                        email: account.email,
                                        password: account.password,
                                        url: account.url || '',
                                        number: account.number || '',
                                        cel: account.cel || ''
                                      })
                                      setShowAddAccount(true)
                                    }}
                                    className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded hover:bg-blue-600 transition-colors"
                                  >
                                    ✏️ Editar
                                  </button>
                                  <button
                                    onClick={handleRemoveAccount}
                                    className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded hover:bg-red-600 transition-colors"
                                  >
                                    🗑️ Remover
                                  </button>
                                </div>
                              </td>
                            </tr>
                          )
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Calendar Tab */}
            {activeTab === 'calendar' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Calendário de Sequência</h2>
                
                <CalendarComponent
                  markedDays={markedDays}
                  setMarkedDays={setMarkedDays}
                  sequences={sequences}
                  setSequences={setSequences}
                  selectedDate={selectedDate}
                  setSelectedDate={setSelectedDate}
                />
              </div>
            )}

            {/* URLs Tab */}
            {activeTab === 'urls' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">🔗 URLs ({urls.length})</h2>
                </div>

                {/* Lista de URLs */}
                <div className="max-h-96 overflow-y-auto space-y-2">
                  {urls.map((url, index) => {
                    // Buscar perfil correspondente para obter a foto
                    const profile = profiles.find(p => p.url === url)
                    const avatar = profile?.avatar || ''
                    const displayName = cleanDisplayName(profile?.displayName || profile?.name || '')
                    
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <span className="text-sm text-gray-500 w-8">{index + 1}.</span>
                        
                        {/* Foto do perfil */}
                        <div className="flex-shrink-0">
                          {avatar ? (
                            <img
                              src={avatar}
                              alt={displayName || 'Avatar'}
                              className="w-10 h-10 rounded-full border-2 border-purple-400 object-cover"
                              onError={(e) => {
                                e.currentTarget.style.display = 'none'
                              }}
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-gray-200 border-2 border-purple-400 flex items-center justify-center">
                              <span className="text-xs text-purple-600 font-bold">
                                {(displayName || url.match(/@([^\/]+)/)?.[1] || '?')[0]?.toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <span className="text-sm text-gray-700 font-mono break-all block">{url}</span>
                          {displayName && (
                            <span className="text-xs text-gray-500 block truncate">{displayName}</span>
                          )}
                        </div>
                      </div>
                    )
                  })}
                  {urls.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhuma URL cadastrada.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* History Tab */}
            {activeTab === 'history' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">📝 Histórico</h2>
                  <a
                    href="/history"
                    className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                  >
                    📊 Ver Detalhes
                  </a>
                </div>
                <p className="text-gray-600 mb-4">
                  Os históricos são salvos automaticamente em arquivos .txt e .json na pasta <code className="bg-gray-100 px-2 py-1 rounded">public/history</code>
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-700 mb-2">
                    Cada execução gera um arquivo com a data e hora da execução contendo todos os dados coletados.
                  </p>
                  <p className="text-sm text-gray-700">
                    Clique em <strong>"Ver Detalhes"</strong> para visualizar os dados detalhados, fotos dos perfis e comparar diferentes execuções.
                  </p>
                </div>
              </div>
            )}

            {/* Groups Tab */}
            {activeTab === 'groups' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                  <h2 className="text-2xl font-bold text-gray-800">👥 Grupos</h2>
                  <div className="flex items-center gap-3">
                    {selectedGroup && (
                      <button
                        onClick={() => setSelectedGroup(null)}
                        className="px-5 py-2.5 bg-white rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm border border-gray-300 hover:border-purple-400 flex items-center gap-2"
                      >
                        <span>←</span>
                        <span>Voltar</span>
                      </button>
                    )}
                    <button
                      onClick={handleExecute}
                      disabled={loading || urls.length === 0}
                      className="px-5 py-2.5 bg-gradient-to-r from-purple-50 to-pink-50 text-purple-700 font-medium rounded-lg hover:from-purple-100 hover:to-pink-100 border border-purple-200 hover:border-purple-300 shadow-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>Atualizar Dados</span>
                    </button>
                  </div>
                </div>

                {!selectedGroup ? (
                  // Lista de Grupos
                  <div>
                    <div className="text-center mb-8">
                      <h3 className="text-xl font-bold text-gray-800 mb-2">Selecione um Grupo</h3>
                      <p className="text-gray-600">Escolha uma faixa de seguidores para visualizar as contas</p>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {Object.entries(groupedAccounts())
                        .sort((a, b) => {
                          // Ordenar: inicio primeiro, depois por número
                          if (a[0] === 'inicio') return -1
                          if (b[0] === 'inicio') return 1
                          const numA = parseInt(a[0].replace('k', '')) || 0
                          const numB = parseInt(b[0].replace('k', '')) || 0
                          return numA - numB
                        })
                        .map(([groupName, accounts]) => {
                          const totalFollowers = accounts.reduce((sum, acc) => {
                            return sum + parseFollowers(acc.followers || '0')
                          }, 0)
                          
                          return (
                            <div
                              key={groupName}
                              onClick={() => setSelectedGroup(groupName)}
                              className="bg-white rounded-2xl p-6 cursor-pointer transition-colors duration-200 border border-gray-200 hover:border-purple-300"
                            >
                              <div className="text-center">
                                <div className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-3">
                                  {groupName === 'inicio' ? '< 1k' : groupName.toUpperCase()}
                                </div>
                                <div className="text-3xl font-bold text-gray-800 mb-1">
                                  {accounts.length}
                                </div>
                                <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold mb-2">contas</div>
                                <div className="text-xs text-gray-500">
                                  {totalFollowers.toLocaleString()} seguidores
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    {Object.keys(groupedAccounts()).length === 0 && (
                      <div className="text-center py-12">
                        <p className="text-lg font-medium text-gray-700 mb-2">Nenhum grupo disponível</p>
                        <p className="text-sm text-gray-500">Execute a análise primeiro ou selecione um histórico.</p>
                      </div>
                    )}
                  </div>
                ) : (
                  // Lista de Contas do Grupo Selecionado
                  <div>
                    <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl px-8 py-4 text-white shadow-lg">
                        <div className="text-xs font-medium opacity-90 mb-1 uppercase tracking-wide">Grupo Selecionado</div>
                        <div className="text-3xl font-black">
                          {selectedGroup === 'inicio' ? '< 1k' : selectedGroup.toUpperCase()}
                        </div>
                        <div className="text-xs opacity-80 mt-2 font-medium">
                          {groupedAccounts()[selectedGroup]?.length || 0} conta(s) neste grupo
                        </div>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {groupedAccounts()[selectedGroup]?.map((profile, index) => {
                        const getKwaiUrl = (): string | null => {
                          if (profile.url) return profile.url
                          
                          // Tentar encontrar pela URL das contas cadastradas
                          const account = accounts.find(acc => {
                            const accEmail = (acc.email || '').toLowerCase().trim()
                            const profileEmail = (profile.email || '').toLowerCase().trim()
                            return accEmail && profileEmail && accEmail === profileEmail
                          })
                          if (account?.url) return account.url
                          
                          // Gerar URL pelo email
                          const emailUsername = profile.email?.split('@')[0] || ''
                          if (emailUsername) {
                            return `https://k.kwai.com/u/@${emailUsername}`
                          }
                          return null
                        }
                        
                        const kwaiUrl = getKwaiUrl()
                        const displayName = cleanDisplayName(profile.displayName || profile.name || profile.username || profile.email || 'N/A')
                        
                        const handleCardClick = () => {
                          if (kwaiUrl) {
                            window.open(kwaiUrl, '_blank')
                          }
                        }
                        
                        return (
                          <div
                            key={index}
                            onClick={handleCardClick}
                            className={`group bg-white rounded-2xl p-6 border-2 transition-all duration-200 cursor-pointer ${
                              kwaiUrl 
                                ? 'border-gray-200 hover:border-purple-400 hover:shadow-xl' 
                                : 'border-gray-200 opacity-60 cursor-not-allowed'
                            }`}
                          >
                            <div className="space-y-4">
                              {/* Avatar e Nome */}
                              <div className="flex items-center gap-4">
                                {profile.avatar ? (
                                  <img
                                    src={profile.avatar}
                                    alt={displayName}
                                    className="w-20 h-20 rounded-2xl border-[3px] border-purple-400 object-cover flex-shrink-0 shadow-lg group-hover:shadow-purple-200 transition-shadow"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 border-[3px] border-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-purple-200 transition-shadow">
                                    <span className="text-3xl text-white font-bold">
                                      {displayName[0]?.toUpperCase() || '?'}
                                    </span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-gray-800 truncate text-lg mb-1 group-hover:text-purple-600 transition-colors">
                                    {displayName}
                                  </div>
                                  {profile.username && (
                                    <div className="text-xs text-gray-500 truncate">
                                      @{profile.username}
                                    </div>
                                  )}
                                </div>
                              </div>
                              
                              {/* Stats */}
                              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-100">
                                <div className="flex items-center gap-2 bg-blue-50 rounded-xl p-2.5">
                                  <div className="w-9 h-9 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs text-blue-600 font-medium">Seguidores</div>
                                    <div className="text-sm font-bold text-gray-800 truncate">{profile.followers || 'N/A'}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2 bg-pink-50 rounded-xl p-2.5">
                                  <div className="w-9 h-9 rounded-lg bg-pink-100 flex items-center justify-center flex-shrink-0">
                                    <svg className="w-4 h-4 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                  </div>
                                  <div className="min-w-0">
                                    <div className="text-xs text-pink-600 font-medium">Curtidas</div>
                                    <div className="text-sm font-bold text-gray-800 truncate">{profile.likes || 'N/A'}</div>
                                  </div>
                                </div>
                              </div>
                              
                              {/* Email */}
                              {profile.email && (
                                <div className="pt-2 border-t border-gray-100">
                                  <div className="flex items-center gap-2 text-xs text-gray-500 truncate">
                                    <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                    <span className="truncate">{profile.email}</span>
                                  </div>
                                </div>
                              )}
                              
                              {/* Indicador de clique */}
                              {kwaiUrl && (
                                <div className="pt-2">
                                  <div className="text-center text-xs font-medium text-purple-600 bg-purple-50 rounded-lg py-2 group-hover:bg-purple-100 transition-colors">
                                    Clique para ver perfil →
                                  </div>
                                </div>
                              )}
                              {!kwaiUrl && (
                                <div className="pt-2">
                                  <div className="text-center text-xs text-gray-400 bg-gray-50 rounded-lg py-2">
                                    Perfil não disponível
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {(!groupedAccounts()[selectedGroup] || groupedAccounts()[selectedGroup].length === 0) && (
                      <div className="text-center py-12 text-gray-500">
                        Nenhuma conta neste grupo.
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Postagem do Dia Tab */}
            {activeTab === 'postagem' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">📝 Postagem do Dia</h2>
                  <button
                    onClick={async () => {
                      const today = new Date().toISOString().split('T')[0]
                      const newDailyPosting = {
                        ...dailyPosting,
                        [today]: { selected: [], startTime: undefined, endTime: undefined }
                      }
                      setDailyPosting(newDailyPosting)
                      
                      try {
                        await fetch('/api/daily-posting', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ postingData: newDailyPosting }),
                        })
                      } catch (e) {
                        console.error('Erro ao reiniciar postagens:', e)
                      }
                    }}
                    className="px-6 py-2 bg-red-500 text-white font-semibold rounded-lg hover:bg-red-600 transition-all"
                  >
                    🔄 Reiniciar
                  </button>
                </div>

                {(() => {
                  const today = new Date().toISOString().split('T')[0]
                  const todayData = dailyPosting[today] || { selected: [] }
                  
                  // Sempre exibir todas as contas
                  let accountsToShow = accounts
                  
                  // Contar todas as contas selecionadas
                  const selectedCount = todayData.selected.length
                  // Total sempre é todas as contas disponíveis
                  const totalAccounts = accounts.length
                  
                  // Verificar se todas as contas foram completadas hoje
                  const isCompleted = postingHistory.some(item => item.date === today)
                  const remaining = totalAccounts - selectedCount

                  return (
                    <>

                      {isCompleted ? (
                        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                          <div className="text-center">
                            <div className="text-3xl mb-2">✅</div>
                            <h3 className="text-xl font-bold text-green-800 mb-2">Concluído para hoje!</h3>
                            <p className="text-green-700 mb-4">
                              Todas as {totalAccounts} contas foram processadas hoje.
                            </p>
                            <p className="text-sm text-green-600">
                              Próxima postagem: Amanhã ({new Date(Date.now() + 86400000).toLocaleDateString('pt-BR')})
                            </p>
                            {(() => {
                              // Buscar os dados de início e fim do histórico de hoje
                              const historyItem = postingHistory.find(item => 
                                item.date === today
                              )
                              return historyItem && historyItem.startTime && historyItem.endTime ? (
                                <div className="mt-4 text-sm text-green-700">
                                  <div>🕐 Início: {new Date(historyItem.startTime).toLocaleTimeString('pt-BR')}</div>
                                  <div>🕐 Fim: {new Date(historyItem.endTime).toLocaleTimeString('pt-BR')}</div>
                                </div>
                              ) : null
                            })()}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700">
                              Progresso: {selectedCount} / {totalAccounts}
                            </span>
                            <span className="text-sm text-gray-600">Faltam {remaining}</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${(selectedCount / totalAccounts) * 100}%` }}
                            ></div>
                          </div>
                          {todayData.startTime && (
                            <div className="mt-2 text-sm text-gray-600">
                              🕐 Início: {new Date(todayData.startTime).toLocaleTimeString('pt-BR')}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {accountsToShow.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm font-semibold">Nenhuma conta disponível.</p>
                          </div>
                        ) : isCompleted && accountsToShow
                          .filter((account) => !todayData.selected.includes(account.email))
                          .length === 0 ? (
                          <div className="text-center py-8 text-green-500">
                            <p className="text-sm font-semibold">✅ Todas as contas já foram selecionadas!</p>
                          </div>
                        ) : (
                          accountsToShow
                            .filter((account) => !todayData.selected.includes(account.email))
                            .map((account, index) => {
                            const accountProfile = profiles.find(p => p.email === account.email) || historyProfiles.find(p => p.email === account.email)
                            
                            const handleClick = async () => {
                              if (isCompleted) return

                              const newSelected = [...todayData.selected, account.email]
                              
                              // Verificar se completou todas as contas (sempre todas, não apenas do grupo)
                              const selectedInGroupAfter = newSelected // Todas as contas selecionadas
                              
                              const now = new Date().toISOString()
                              const newTodayData = {
                                ...todayData,
                                selected: newSelected,
                                startTime: selectedInGroupAfter.length === 1 && !todayData.startTime ? now : todayData.startTime,
                                endTime: selectedInGroupAfter.length === totalAccounts ? now : (selectedInGroupAfter.length < totalAccounts ? undefined : todayData.endTime)
                                // Remover campos de grupo - não usamos mais grupos
                              }

                              const newDailyPosting = {
                                ...dailyPosting,
                                [today]: newTodayData
                              }

                              setDailyPosting(newDailyPosting)

                              if (account.email) {
                                try {
                                  await navigator.clipboard.writeText(account.email)
                                } catch (e) {
                                  console.error('Erro ao copiar email:', e)
                                }
                              }

                              try {
                                const requestBody: any = { postingData: newDailyPosting }
                                
                                // Se completou, adicionar ao histórico
                                if (selectedInGroupAfter.length === totalAccounts && newTodayData.startTime && newTodayData.endTime) {
                                  requestBody.addToHistory = {
                                    date: today,
                                    startTime: newTodayData.startTime,
                                    endTime: newTodayData.endTime,
                                    totalAccounts: totalAccounts
                                  }
                                }
                                
                                const response = await fetch('/api/daily-posting', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify(requestBody),
                                })
                                
                                if (response.ok && requestBody.addToHistory) {
                                  // Usar a resposta do servidor que contém a data corrigida
                                  const responseData = await response.json()
                                  const historyEntry = responseData.historyEntry || requestBody.addToHistory
                                  const updatedHistory = [historyEntry, ...postingHistory]
                                  setPostingHistory(updatedHistory)
                                  
                                  // Usar a data do servidor para marcar no calendário
                                  const serverDate = historyEntry.date || today
                                  if (!markedDays[serverDate]) {
                                    const newMarkedDays = { ...markedDays, [serverDate]: true }
                                    setMarkedDays(newMarkedDays)
                                    
                                    try {
                                      await fetch('/api/calendar', {
                                        method: 'POST',
                                        headers: {
                                          'Content-Type': 'application/json',
                                        },
                                        body: JSON.stringify({
                                          markedDays: newMarkedDays,
                                          sequences: sequences
                                        }),
                                      })
                                    } catch (e) {
                                      console.error('Erro ao marcar dia no calendário:', e)
                                    }
                                  }
                                }
                              } catch (e) {
                                console.error('Erro ao salvar postagens:', e)
                              }
                            }

                            return (
                              <div
                                key={index}
                                onClick={handleClick}
                                className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50 hover:bg-gray-100 cursor-pointer transition-all"
                              >
                                <div className="flex-shrink-0">
                                  {accountProfile?.avatar ? (
                                    <img
                                      src={accountProfile.avatar}
                                      alt={account.name || account.email}
                                      className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-purple-400 flex items-center justify-center">
                                      <span className="text-sm text-purple-600 font-bold">
                                        {(account.name || account.email || '?')[0]?.toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-800 truncate">
                                    {account.name || account.email || 'N/A'}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate">
                                    {account.email}
                                  </div>
                                </div>
                              </div>
                            )
                          })
                        )}
                      </div>

                      {/* Histórico de Postagens */}
                      {postingHistory.length > 0 && (
                        <div className="mt-8 pt-6 border-t border-gray-200">
                          <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Histórico de Postagens</h3>
                          <div className="space-y-2 max-h-64 overflow-y-auto">
                            {postingHistory.map((item, index) => {
                              // Formatar data corretamente (parse manual para evitar problema de timezone)
                              const formatDate = (dateStr: string): string => {
                                if (!dateStr) return ''
                                const parts = dateStr.split('-')
                                if (parts.length === 3) {
                                  // Formato YYYY-MM-DD -> DD/MM/YYYY
                                  return `${parts[2]}/${parts[1]}/${parts[0]}`
                                }
                                // Se já estiver formatada ou formato diferente, tentar parsear
                                const date = new Date(dateStr)
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString('pt-BR')
                                }
                                return dateStr
                              }
                              
                              return (
                                                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-800">
                                      {formatDate(item.date)}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      🕐 Início: {new Date(item.startTime).toLocaleTimeString('pt-BR')} • 
                                      Fim: {new Date(item.endTime).toLocaleTimeString('pt-BR')} • 
                                      {item.totalAccounts} contas
                                    </div>
                                  </div>
                                <button
                                  onClick={async () => {
                                    const itemToRemove = postingHistory[index]
                                    
                                    try {
                                      const response = await fetch('/api/daily-posting', {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ removeFromHistory: index }),
                                      })
                                      
                                      if (response.ok) {
                                        // Remover do estado local apenas após confirmação do servidor
                                        const newHistory = postingHistory.filter((_, i) => i !== index)
                                        setPostingHistory(newHistory)
                                        

                                        // Verificar se ainda há outros itens desse mesmo dia no histórico
                                        // Só remover a marcação do calendário se não houver mais nenhum item desse dia
                                        if (itemToRemove && itemToRemove.date) {
                                          const dateToCheck = itemToRemove.date
                                          const hasOtherItemsOnSameDate = newHistory.some(item => item.date === dateToCheck)
                                          
                                          // Se não há mais itens desse dia, remover a marcação do calendário
                                          if (!hasOtherItemsOnSameDate) {
                                            const newMarkedDays = { ...markedDays }
                                            delete newMarkedDays[dateToCheck]
                                            setMarkedDays(newMarkedDays)
                                            
                                            try {
                                              await fetch('/api/calendar', {
                                                method: 'POST',
                                                headers: {
                                                  'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                  markedDays: newMarkedDays,
                                                  sequences: sequences
                                                }),
                                              })
                                            } catch (e) {
                                              console.error('Erro ao desmarcar dia no calendário:', e)
                                            }
                                          }
                                        }
                                        
                                        // Recarregar o histórico do servidor para garantir sincronização
                                        try {
                                          const historyResponse = await fetch('/api/daily-posting')
                                          if (historyResponse.ok) {
                                            const historyData = await historyResponse.json()
                                            if (historyData.history) {
                                              setPostingHistory(historyData.history)
                                            }
                                            if (historyData.postingData) {
                                              setDailyPosting(historyData.postingData)
                                            }
                                          }
                                        } catch (e) {
                                          console.error('Erro ao recarregar histórico:', e)
                                        }
                                      } else {
                                        console.error('Erro ao remover do histórico: resposta não OK')
                                        alert('Erro ao remover item do histórico. Tente novamente.')
                                      }
                                    } catch (e) {
                                      console.error('Erro ao remover do histórico:', e)
                                      alert('Erro ao remover item do histórico. Tente novamente.')
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition-all"
                                >
                                  🗑️ Remover
                                </button>
                              </div>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </>
                  )
                })()}
              </div>
            )}

            {/* Catalog Config Tab */}
            {activeTab === 'catalog-config' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">🎨 Configurar Catálogo</h2>
                
                <div className="space-y-6 mb-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Tempo de Expiração *</label>
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => setCatalogConfig({ ...catalogConfig, expirationMinutes: 5 })}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          catalogConfig.expirationMinutes === 5
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        5 minutos
                      </button>
                      <button
                        onClick={() => setCatalogConfig({ ...catalogConfig, expirationMinutes: 10 })}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          catalogConfig.expirationMinutes === 10
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        10 minutos
                      </button>
                      <button
                        onClick={() => setCatalogConfig({ ...catalogConfig, expirationMinutes: 15 })}
                        className={`px-4 py-3 rounded-lg font-semibold transition-all ${
                          catalogConfig.expirationMinutes === 15
                            ? 'bg-purple-600 text-white shadow-md'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        15 minutos
                      </button>
                    </div>
                  </div>

                  {/* Seleção de Grupos */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">Selecionar Grupos de Seguidores *</label>
                    <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 max-h-64 overflow-y-auto">
                      {(() => {
                        const groups = groupedAccounts()
                        const groupNames = Object.keys(groups).sort((a, b) => {
                          if (a === 'inicio') return -1
                          if (b === 'inicio') return 1
                          const numA = parseInt(a.replace('k', '')) || 0
                          const numB = parseInt(b.replace('k', '')) || 0
                          return numA - numB
                        })

                        if (groupNames.length === 0) {
                          return (
                            <p className="text-sm text-gray-500 text-center py-4">
                              Nenhum grupo disponível. Execute a análise primeiro.
                            </p>
                          )
                        }

                        return (
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {groupNames.map((groupName) => {
                              const isSelected = catalogConfig.selectedGroups.includes(groupName)
                              return (
                                <button
                                  key={groupName}
                                  onClick={() => {
                                    if (isSelected) {
                                      setCatalogConfig({
                                        ...catalogConfig,
                                        selectedGroups: catalogConfig.selectedGroups.filter(g => g !== groupName)
                                      })
                                    } else {
                                      setCatalogConfig({
                                        ...catalogConfig,
                                        selectedGroups: [...catalogConfig.selectedGroups, groupName]
                                      })
                                    }
                                  }}
                                  className={`p-3 rounded-lg border-2 transition-all text-left ${
                                    isSelected
                                      ? 'bg-purple-100 border-purple-500'
                                      : 'bg-white border-gray-200 hover:border-purple-300'
                                  }`}
                                >
                                  <div className="font-bold text-gray-800 mb-1">
                                    {groupName === 'inicio' ? '< 1k' : groupName.toUpperCase()}
                                  </div>
                                  <div className="text-xs text-gray-600">
                                    {groups[groupName].length} conta(s)
                                  </div>
                                </button>
                              )
                            })}
                          </div>
                        )
                      })()}
                    </div>
                    {catalogConfig.selectedGroups.length > 0 && (
                      <p className="text-xs text-gray-600 mt-2">
                        {catalogConfig.selectedGroups.length} grupo(s) selecionado(s)
                      </p>
                    )}
                  </div>
                  
                  <button
                    onClick={async () => {
                      if (!catalogConfig.expirationMinutes) {
                        setError('Selecione o tempo de expiração')
                        return
                      }
                      if (catalogConfig.selectedGroups.length === 0) {
                        setError('Selecione pelo menos um grupo')
                        return
                      }
                      
                      try {
                        const response = await fetch('/api/catalog-config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: 'Contas do Kwai',
                            expirationMinutes: catalogConfig.expirationMinutes,
                            selectedGroups: catalogConfig.selectedGroups
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          setCatalogLink(data.catalog.link)
                          setCatalogConfig({ expirationMinutes: null, selectedGroups: [] })
                          
                          // Recarregar lista de catálogos
                          const listResponse = await fetch('/api/catalog-config')
                          if (listResponse.ok) {
                            const listData = await listResponse.json()
                            const now = new Date()
                            const activeCatalogs = listData.catalogs.filter((cat: any) => {
                              if (cat.expiresAt) {
                                return new Date(cat.expiresAt) > now
                              }
                              return true
                            })
                            setCatalogs(activeCatalogs)
                          }
                        }
                      } catch (e) {
                        console.error('Erro ao criar catálogo:', e)
                        setError('Erro ao criar catálogo')
                      }
                    }}
                    className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
                  >
                    ✅ Criar Catálogo
                  </button>
                </div>

                {catalogLink && (
                  <div className="bg-green-50 border-2 border-green-500 rounded-lg p-4 mb-6">
                    <p className="text-sm text-gray-700 mb-2">Catálogo criado com sucesso!</p>
                    <p className="text-sm font-semibold text-gray-800 mb-2">Link do catálogo:</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={`${typeof window !== 'undefined' ? window.location.origin : ''}/catalog/${catalogLink}`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded-lg font-mono text-sm"
                      />
                      <button
                        onClick={() => {
                          const fullLink = `${typeof window !== 'undefined' ? window.location.origin : ''}/catalog/${catalogLink}`
                          navigator.clipboard.writeText(fullLink)
                        }}
                        className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
                      >
                        📋 Copiar
                      </button>
                    </div>
                  </div>
                )}

                {catalogs.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Catálogos Ativos</h3>
                    <div className="space-y-2">
                      {catalogs.map((catalog) => {
                        const expiresAt = new Date(catalog.expiresAt)
                        const now = new Date()
                        const minutesLeft = Math.max(0, Math.floor((expiresAt.getTime() - now.getTime()) / 60000))
                        
                        return (
                          <div
                            key={catalog.link}
                            className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                          >
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">{catalog.name}</div>
                              <div className="text-sm text-gray-600">
                                Número: {catalog.number} • Expira em: {minutesLeft} minutos
                              </div>
                              <a
                                href={`/catalog/${catalog.link}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-purple-600 font-mono mt-1 hover:text-purple-800 hover:underline cursor-pointer block"
                              >
                                /catalog/{catalog.link}
                              </a>
                            </div>
                            <button
                              onClick={async () => {
                                try {
                                  const response = await fetch('/api/catalog-config', {
                                    method: 'DELETE',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ link: catalog.link }),
                                  })
                                  
                                  if (response.ok) {
                                    const newCatalogs = catalogs.filter(c => c.link !== catalog.link)
                                    setCatalogs(newCatalogs)
                                  } else {
                                    const errorData = await response.json()
                                    setError(errorData.error || 'Erro ao remover catálogo')
                                    console.error('Erro ao remover catálogo:', errorData)
                                  }
                                } catch (e: any) {
                                  console.error('Erro ao remover catálogo:', e)
                                  setError('Erro ao conectar com o servidor')
                                }
                              }}
                              className="px-3 py-1 bg-red-500 text-white text-sm font-semibold rounded hover:bg-red-600 transition-all"
                            >
                              🗑️ Remover
                            </button>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Config Tab */}
            {activeTab === 'config' && (
              <ConfigTab />
            )}
          </div>
        </main>
      </div>
    </div>
  )
}

// Componente da aba Config
function ConfigTab() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  // Carregar configuração ao montar
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/auth/config')
        if (response.ok) {
          const data = await response.json()
          setUsername(data.username || '')
          // Senha sempre fica em branco
          setPassword('')
        }
      } catch (e) {
        console.error('Erro ao carregar configuração:', e)
        setError('Erro ao carregar configurações')
      }
    }
    loadConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setSuccess(false)
    setError('')

    if (!password || password.trim() === '') {
      setError('A senha é obrigatória')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/config', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json()

      if (data.success) {
        setSuccess(true)
        setPassword('') // Limpar campo de senha após salvar
        setTimeout(() => setSuccess(false), 3000)
      } else {
        setError(data.error || 'Erro ao salvar configurações')
      }
    } catch (err) {
      setError('Erro ao conectar com o servidor')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">⚙️ Configurações</h2>

      <form onSubmit={handleSubmit} className="space-y-6 max-w-md">
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
            Usuário (Login)
          </label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Digite o usuário"
          />
          <p className="mt-1 text-xs text-gray-500">Este é o nome de usuário usado para fazer login no sistema.</p>
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
            Senha
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition"
            placeholder="Digite a nova senha"
          />
          <p className="mt-1 text-xs text-gray-500">Digite a nova senha para alterar. O campo sempre aparece em branco por segurança.</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
            ✅ Configurações atualizadas com sucesso!
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Salvando...' : '💾 Salvar Configurações'}
        </button>
      </form>
    </div>
  )
}