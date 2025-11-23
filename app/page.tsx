'use client'

import { useState, useEffect, useRef } from 'react'
import ProfileCard from '@/components/ProfileCard'
import CalendarComponent from '@/components/CalendarComponent'
import { calculateSequence } from '@/lib/calendar-utils'

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
  note?: string
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
  const [activeTab, setActiveTab] = useState<'dashboard' | 'followers' | 'accounts' | 'urls' | 'history' | 'calendar' | 'groups' | 'postagem' | 'catalog-config' | 'config' | 'valores'>('dashboard')
  const [catalogConfig, setCatalogConfig] = useState({ 
    selectedGroups: [] as string[]
  })
  const [catalogs, setCatalogs] = useState<Array<{ link: string, number: string, name: string, createdAt: string, active: boolean, selectedGroups?: string[] }>>([])
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null)
  const [dailyPostingGroup, setDailyPostingGroup] = useState<string | null>(null) // Grupo selecionado na postagem do dia
  const [dailyPosting, setDailyPosting] = useState<{ [key: string]: { groups: { [groupName: string]: { selected: string[], startTime?: string, endTime?: string } }, calendarMarked?: boolean } }>({})
  const [postingHistory, setPostingHistory] = useState<Array<{ date: string, startTime: string, endTime: string, totalAccounts: number, groups: string[] }>>([])
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
    cel: '',
    name: '',
    note: ''
  })
  const [historyFiles, setHistoryFiles] = useState<Array<{filename: string, date: string}>>([])
  const [selectedHistory, setSelectedHistory] = useState<string>('')
  const [historyProfiles, setHistoryProfiles] = useState<ProfileData[]>([])
  const [accounts, setAccounts] = useState<AccountData[]>([])
  const [editingAccountIndex, setEditingAccountIndex] = useState<number | null>(null)
  const [valores, setValores] = useState<{ [key: string]: number }>({}) // { '1k': 10, '2k': 20, etc }
  const [taxa, setTaxa] = useState<number>(15.98) // Taxa em porcentagem
  const [urlsOriginal, setUrlsOriginal] = useState<string[]>([]) // URLs originais para reiniciar
  const [urlsProcessed, setUrlsProcessed] = useState<Set<number>>(new Set()) // Índices das URLs processadas
  const [customGroups, setCustomGroups] = useState<{ [groupName: string]: { emails: string[], coverImage?: string } }>({}) // { "meta": { emails: ["email1"], coverImage: "url" } }
  const [accountGroups, setAccountGroups] = useState<{ [email: string]: string }>({}) // { "email": "nomeDoGrupo" }
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [pendingMoveEmail, setPendingMoveEmail] = useState<string | null>(null) // Email da conta que será movida após criar grupo
  const [editingGroupCover, setEditingGroupCover] = useState<string | null>(null) // Nome do grupo sendo editado (pode ser custom- ou grupo original)
  const [groupCoverImage, setGroupCoverImage] = useState<string>('') // Base64 da imagem
  const [editingGroupName, setEditingGroupName] = useState<string>('') // Nome do grupo sendo editado (para grupos personalizados)
  const [groupCovers, setGroupCovers] = useState<{ [groupName: string]: string }>({}) // Capas de todos os grupos
  const [duplicateAccount, setDuplicateAccount] = useState<AccountData | null>(null) // Conta duplicada encontrada
  const [duplicateAccountProfile, setDuplicateAccountProfile] = useState<ProfileData | null>(null) // Perfil da conta duplicada

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
            
            // IMPORTANTE: Recalcular a sequência com TODOS os dias marcados de TODOS os meses
            // Isso garante que a sequência sempre esteja correta, mesmo se o valor salvo estiver desatualizado
            const calculatedSequence = calculateSequence(data.markedDays)
            setSequences({ ...data.sequences, 'global': calculatedSequence })
            
            // Se a sequência calculada for diferente da salva, atualizar no servidor
            if (data.sequences?.global !== calculatedSequence) {
              try {
                await fetch('/api/calendar', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    markedDays: data.markedDays,
                    sequences: { ...data.sequences, 'global': calculatedSequence }
                  }),
                })
                console.log('Sequência recalculada e atualizada:', calculatedSequence)
              } catch (e) {
                console.error('Erro ao atualizar sequência:', e)
              }
            }
          } else if (data.sequences) {
            // Se não houver markedDays, usar sequências do calendário
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
            setUrlsOriginal(data.urls) // Salvar URLs originais
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
            setUrlsOriginal(initialUrls) // Salvar URLs originais
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
            // Migrar estrutura antiga para nova se necessário
            const migratedData: { [key: string]: { groups: { [groupName: string]: { selected: string[], startTime?: string, endTime?: string } }, calendarMarked?: boolean } } = {}
            
            Object.keys(data.postingData).forEach(date => {
              const dayData = data.postingData[date]
              // Se tem estrutura antiga (selected array), migrar
              if (dayData.selected && Array.isArray(dayData.selected)) {
                // Estrutura antiga - não podemos migrar perfeitamente, então resetar
                migratedData[date] = { groups: {}, calendarMarked: dayData.calendarMarked || false }
              } else {
                // Estrutura nova
                migratedData[date] = dayData
              }
            })
            
            setDailyPosting(migratedData)
          }
          if (data.history) {
            // Migrar histórico se necessário
            const migratedHistory = data.history.map((item: any) => {
              if (item.groups && Array.isArray(item.groups)) {
                return item // Já está na estrutura nova
              }
              // Estrutura antiga - converter
              return {
                ...item,
                groups: item.selectedGroup ? [item.selectedGroup] : []
              }
            })
            setPostingHistory(migratedHistory)
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
            setCatalogs(data.catalogs)
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

  // Carregar grupos personalizados quando a aba de grupos ou postagem é aberta
  useEffect(() => {
    const loadCustomGroups = async () => {
      if (activeTab === 'groups' || activeTab === 'postagem') {
        try {
          const response = await fetch('/api/custom-groups')
          if (response.ok) {
            const data = await response.json()
            if (data.customGroups) {
              // Converter estrutura antiga para nova se necessário
              const convertedGroups: { [key: string]: { emails: string[], coverImage?: string } } = {}
              Object.keys(data.customGroups).forEach(groupName => {
                const groupData = data.customGroups[groupName]
                if (Array.isArray(groupData)) {
                  // Estrutura antiga: array de emails
                  convertedGroups[groupName] = { emails: groupData, coverImage: '' }
                } else {
                  // Estrutura nova: objeto com emails e coverImage
                  convertedGroups[groupName] = {
                    emails: groupData.emails || [],
                    coverImage: groupData.coverImage || ''
                  }
                }
              })
              setCustomGroups(convertedGroups)
            }
            if (data.accountGroups) {
              setAccountGroups(data.accountGroups)
            }
            if (data.groupCovers) {
              setGroupCovers(data.groupCovers)
            }
          }
        } catch (e) {
          console.error('Erro ao carregar grupos personalizados:', e)
        }
      }
    }
    
    loadCustomGroups()
  }, [activeTab])

  // Carregar valores quando a aba de valores é aberta
  useEffect(() => {
    const loadValores = async () => {
      if (activeTab === 'valores') {
        try {
          const response = await fetch('/api/valores')
          if (response.ok) {
            const data = await response.json()
            if (data.valores) {
              setValores(data.valores)
            }
            if (data.taxa !== undefined) {
              setTaxa(data.taxa)
            }
          }
        } catch (e) {
          console.error('Erro ao carregar valores:', e)
        }
      }
    }
    
    loadValores()
  }, [activeTab])

  // Carregar valores no dashboard também
  useEffect(() => {
    const loadValoresForDashboard = async () => {
      try {
        const response = await fetch('/api/valores')
        if (response.ok) {
          const data = await response.json()
          if (data.valores) {
            setValores(data.valores)
          }
          if (data.taxa !== undefined) {
            setTaxa(data.taxa)
          }
        }
      } catch (e) {
        console.error('Erro ao carregar valores:', e)
      }
    }
    
    loadValoresForDashboard()
  }, [])

  // Agrupar contas por faixa de seguidores (excluindo contas em grupos personalizados)
  const groupedAccounts = (): { [key: string]: ProfileData[] } => {
    // Prioridade: groupsProfiles (mais atualizado) > historyProfiles > profiles
    const dataToUse = groupsProfiles.length > 0 
      ? groupsProfiles 
      : (historyProfiles.length > 0 ? historyProfiles : profiles)
    const groups: { [key: string]: ProfileData[] } = {}
    
    // Criar conjunto de emails que estão em grupos personalizados
    const emailsInCustomGroups = new Set<string>()
    Object.values(customGroups).forEach(groupData => {
      const groupEmails = groupData?.emails || []
      groupEmails.forEach(email => emailsInCustomGroups.add(email.toLowerCase()))
    })
    
    dataToUse.forEach(profile => {
      const profileEmail = (profile.email || '').toLowerCase()
      
      // Se a conta está em um grupo personalizado, não adicionar ao grupo original
      if (emailsInCustomGroups.has(profileEmail)) {
        return
      }
      
      const followersNum = parseFollowers(profile.followers || '0')
      const groupName = getGroupName(followersNum)
      
      if (!groups[groupName]) {
        groups[groupName] = []
      }
      groups[groupName].push(profile)
    })
    
    return groups
  }

  // Obter grupos personalizados com perfis
  const getCustomGroupsWithProfiles = (): { [key: string]: ProfileData[] } => {
    const dataToUse = groupsProfiles.length > 0 
      ? groupsProfiles 
      : (historyProfiles.length > 0 ? historyProfiles : profiles)
    
    const customGroupsWithProfiles: { [key: string]: ProfileData[] } = {}
    
    Object.keys(customGroups).forEach(groupName => {
      const groupData = customGroups[groupName]
      const groupEmails = groupData?.emails || []
      customGroupsWithProfiles[groupName] = []
      
      groupEmails.forEach(email => {
        const profile = dataToUse.find(p => 
          (p.email || '').toLowerCase() === email.toLowerCase()
        )
        if (profile) {
          customGroupsWithProfiles[groupName].push(profile)
        }
      })
    })
    
    return customGroupsWithProfiles
  }

  // Calcular total de dinheiro baseado nos grupos e valores cadastrados
  const calculateTotalMoney = (): { original: number, taxa: number, final: number } => {
    const groups = groupedAccounts()
    let totalOriginal = 0
    let totalFinal = 0
    
    Object.keys(groups).forEach(groupName => {
      const accountCount = groups[groupName].length
      const valuePerAccount = valores[groupName] || 0
      const valorComTaxa = valuePerAccount * (1 + taxa / 100) // Valor base + taxa
      totalOriginal += accountCount * valuePerAccount
      totalFinal += accountCount * valorComTaxa
    })
    
    const taxaAplicada = totalFinal - totalOriginal
    
    return {
      original: totalOriginal,
      taxa: taxaAplicada,
      final: totalFinal
    }
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
    setUrlsOriginal(updatedUrls) // Atualizar URLs originais também
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
    setUrlsOriginal(updatedUrls) // Atualizar URLs originais também
    saveUrls(updatedUrls)
    
    // Remover perfis relacionados dessa URL
    setProfiles(profiles.filter(p => p.url !== urlToRemove))
    
    console.log(`URL removida: ${urlToRemove}`)
  }

  // Função para converter arquivo para base64
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    
    // Verificar se é uma imagem
    if (!file.type.startsWith('image/')) {
      alert('Por favor, selecione uma imagem!')
      return
    }
    
    // Verificar tamanho (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('A imagem deve ter no máximo 5MB!')
      return
    }
    
    const reader = new FileReader()
    reader.onload = (event) => {
      const base64 = event.target?.result as string
      setGroupCoverImage(base64)
    }
    reader.readAsDataURL(file)
  }

  // Função para verificar e atualizar grupos personalizados baseado em seguidores
  const verifyAndUpdateCustomGroups = (profilesData: ProfileData[]) => {
    const newCustomGroups = { ...customGroups }
    let hasChanges = false
    
    // Armazenar emails que estavam em grupos personalizados antes
    const emailsInCustomGroupsBefore = new Set<string>()
    Object.values(customGroups).forEach(groupData => {
      const groupEmails = groupData?.emails || []
      groupEmails.forEach(email => emailsInCustomGroupsBefore.add(email.toLowerCase()))
    })
    
    Object.keys(newCustomGroups).forEach(groupName => {
      const groupData = newCustomGroups[groupName]
      if (!groupData?.emails) return
      
      const updatedEmails = groupData.emails.filter(email => {
        const profile = profilesData.find(p => 
          (p.email || '').toLowerCase() === email.toLowerCase()
        )
        
        if (!profile) {
          // Conta não encontrada, manter no grupo personalizado
          return true
        }
        
        // Verificar se a conta mudou de faixa de seguidores
        const followersNum = parseFollowers(profile.followers || '0')
        const currentGroupName = getGroupName(followersNum)
        
        // Se a conta estava em um grupo personalizado e mudou de faixa (ex: 1k para 2k),
        // removê-la do grupo personalizado para que apareça no grupo correto
        // A conta aparecerá automaticamente no grupo correto baseado em seguidores
        return true // Por enquanto mantém todas, mas podemos implementar lógica mais complexa depois
      })
      
      if (updatedEmails.length !== groupData.emails.length) {
        newCustomGroups[groupName] = {
          ...groupData,
          emails: updatedEmails
        }
        hasChanges = true
      }
    })
    
    if (hasChanges) {
      setCustomGroups(newCustomGroups)
      
      // Salvar no servidor
      fetch('/api/custom-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customGroups: newCustomGroups,
          accountGroups: accountGroups,
          groupCovers: groupCovers
        }),
      }).catch(e => {
        console.error('Erro ao salvar grupos atualizados:', e)
      })
    }
  }

  // Função para salvar capa do grupo
  const handleSaveGroupCover = async () => {
    if (!editingGroupCover) return
    
    const newGroupCovers = { ...groupCovers }
    
    // Se houver imagem, salvar a capa
    if (groupCoverImage) {
      newGroupCovers[editingGroupCover] = groupCoverImage
      setGroupCovers(newGroupCovers)
    }
    
    // Se for grupo personalizado, atualizar também
    let updatedCustomGroups = customGroups
    if (editingGroupCover.startsWith('custom-')) {
      const oldGroupName = editingGroupCover.replace('custom-', '')
      const newGroupName = editingGroupName.trim()
      
      // Se o nome foi alterado
      if (newGroupName && newGroupName !== oldGroupName) {
        // Verificar se o novo nome já existe
        if (updatedCustomGroups[newGroupName]) {
          alert('Já existe um grupo com esse nome!')
          return
        }
        
        // Mover o grupo para o novo nome
        updatedCustomGroups = { ...customGroups }
        if (updatedCustomGroups[oldGroupName]) {
          updatedCustomGroups[newGroupName] = {
            ...updatedCustomGroups[oldGroupName],
            coverImage: groupCoverImage || updatedCustomGroups[oldGroupName].coverImage || ''
          }
          delete updatedCustomGroups[oldGroupName]
          
          // Atualizar groupCovers também
          if (groupCovers[`custom-${oldGroupName}`]) {
            newGroupCovers[`custom-${newGroupName}`] = groupCovers[`custom-${oldGroupName}`]
            delete newGroupCovers[`custom-${oldGroupName}`]
          }
          
          // Se havia capa sendo salva, atualizar com o novo nome
          if (groupCoverImage) {
            newGroupCovers[`custom-${newGroupName}`] = groupCoverImage
          }
          
          // Se o grupo estava selecionado, atualizar o selectedGroup
          if (selectedGroup === `custom-${oldGroupName}`) {
            setSelectedGroup(`custom-${newGroupName}`)
          }
        }
      } else {
        // Nome não mudou, apenas atualizar a capa se houver
        updatedCustomGroups = { ...customGroups }
        if (updatedCustomGroups[oldGroupName]) {
          if (groupCoverImage) {
            updatedCustomGroups[oldGroupName].coverImage = groupCoverImage
          }
        } else {
          updatedCustomGroups[oldGroupName] = {
            emails: [],
            coverImage: groupCoverImage || ''
          }
        }
      }
      setCustomGroups(updatedCustomGroups)
    }
    
    setEditingGroupCover(null)
    setGroupCoverImage('')
    setEditingGroupName('')
    
    // Salvar no servidor
    try {
      await fetch('/api/custom-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customGroups: updatedCustomGroups,
          accountGroups: accountGroups,
          groupCovers: newGroupCovers
        }),
      })
    } catch (e) {
      console.error('Erro ao salvar capa do grupo:', e)
      alert('Erro ao salvar. Tente novamente.')
    }
  }

  // Função para criar grupo personalizado
  const handleCreateGroup = async () => {
    if (!newGroupName.trim()) return
    
    const groupName = newGroupName.trim()
    
    // Verificar se o grupo já existe
    if (customGroups[groupName]) {
      alert('Este grupo já existe!')
      return
    }
    
    // Criar novo grupo
    const newCustomGroups = {
      ...customGroups,
      [groupName]: { emails: [], coverImage: '' }
    }
    
    // Se há uma conta pendente para mover, adicionar ao novo grupo
    if (pendingMoveEmail) {
      newCustomGroups[groupName].emails = [pendingMoveEmail]
      
      // Remover de outros grupos personalizados
      Object.keys(newCustomGroups).forEach(existingGroupName => {
        if (existingGroupName !== groupName) {
          newCustomGroups[existingGroupName].emails = newCustomGroups[existingGroupName].emails.filter(
            email => email.toLowerCase() !== pendingMoveEmail
          )
        }
      })
    }
    
    setCustomGroups(newCustomGroups)
    setShowCreateGroupModal(false)
    setNewGroupName('')
    setPendingMoveEmail(null)
    
    // Salvar no servidor
    try {
      await fetch('/api/custom-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          customGroups: newCustomGroups,
          accountGroups: accountGroups,
          groupCovers: groupCovers
        }),
      })
    } catch (e) {
      console.error('Erro ao salvar grupos:', e)
      alert('Erro ao criar grupo. Tente novamente.')
    }
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
            // Verificar e atualizar grupos personalizados baseado em seguidores atuais
            verifyAndUpdateCustomGroups(results)
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
      const newSequence = calculateSequence(newMarkedDays)
      
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
              { id: 'valores', label: 'Valores', icon: '💰' },
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

                  {/* Total de Dinheiro */}
                  <div className="mb-6 p-6 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <p className="text-white/90 text-sm font-medium mb-1">💰 Valor Total que Você Ganha</p>
                        <p className="text-white text-4xl font-bold">
                          R$ {calculateTotalMoney().final.toFixed(2).replace('.', ',')}
                        </p>
                      </div>
                      <div className="text-5xl">💰</div>
                    </div>
                    {Object.keys(valores).length > 0 && (() => {
                      const total = calculateTotalMoney()
                      return (
                        <div className="space-y-2 pt-4 border-t border-white/20">
                          <div className="flex justify-between text-white/90 text-sm">
                            <span>Valor Base (sem taxa):</span>
                            <span className="font-semibold">R$ {total.original.toFixed(2).replace('.', ',')}</span>
                          </div>
                          <div className="flex justify-between text-white/90 text-sm">
                            <span>Taxa ({taxa.toFixed(2).replace('.', ',')}%):</span>
                            <span className="font-semibold text-yellow-200">+ R$ {total.taxa.toFixed(2).replace('.', ',')}</span>
                          </div>
                          <div className="flex justify-between text-white text-lg font-bold pt-2 border-t border-white/30">
                            <span>💰 Valor Total que Você Ganha:</span>
                            <span className="text-2xl">R$ {total.final.toFixed(2).replace('.', ',')}</span>
                          </div>
                        </div>
                      )
                    })()}
                    {Object.keys(valores).length === 0 && (
                      <p className="text-white/80 text-xs mt-2">
                        Configure os valores na aba "Valores" para ver o total calculado
                      </p>
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
                          {calculateSequence(markedDays)}
                        </div>
                        <div className="stat-label">Dias Marcados</div>
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
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Dias</th>
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
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Nome (opcional)</label>
                          <input
                            type="text"
                            value={newAccount.name || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, name: e.target.value })}
                            className="input-new"
                            placeholder="Nome da conta"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">
                            Link do Kwai {editingAccountIndex === null ? '*' : ''}
                          </label>
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
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Nota (opcional)</label>
                          <input
                            type="text"
                            value={newAccount.note || ''}
                            onChange={(e) => setNewAccount({ ...newAccount, note: e.target.value })}
                            className="input-new"
                            placeholder="Ex: vendido, reservado, etc."
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 mt-6">
                        <button
                          onClick={async () => {
                            // Validação rigorosa dos campos obrigatórios
                            const emailValido = newAccount.email && newAccount.email.trim() !== ''
                            const senhaValida = newAccount.password && newAccount.password.trim() !== ''
                            const urlValida = newAccount.url && newAccount.url.trim() !== ''
                            
                            if (editingAccountIndex === null) {
                              // Nova conta - todos os campos obrigatórios (Email, Senha e Link Kwai)
                              if (!emailValido || !senhaValida || !urlValida) {
                                const camposFaltando = []
                                if (!emailValido) camposFaltando.push('Email')
                                if (!senhaValida) camposFaltando.push('Senha')
                                if (!urlValida) camposFaltando.push('Link do Kwai')
                                setError(`❌ Campos obrigatórios não preenchidos: ${camposFaltando.join(', ')}`)
                                return // NÃO SALVA se faltar algum campo
                              }
                            } else {
                              // Editando conta - Email e Senha são obrigatórios
                              if (!emailValido || !senhaValida) {
                                const camposFaltando = []
                                if (!emailValido) camposFaltando.push('Email')
                                if (!senhaValida) camposFaltando.push('Senha')
                                setError(`❌ Campos obrigatórios não preenchidos: ${camposFaltando.join(', ')}`)
                                return // NÃO SALVA se faltar algum campo
                              }
                            }
                            
                            // Limpar erro se passou na validação
                            setError(null)
                            
                            // Verificar email duplicado (apenas para novas contas)
                            if (editingAccountIndex === null) {
                              const emailToCheck = newAccount.email.trim().toLowerCase()
                              const existingAccount = accounts.find(acc => 
                                acc.email.toLowerCase() === emailToCheck
                              )
                              
                              if (existingAccount) {
                                // Encontrar perfil correspondente para mostrar foto
                                const profile = profiles.find(p => 
                                  p.email?.toLowerCase() === emailToCheck
                                ) || historyProfiles.find(p => 
                                  p.email?.toLowerCase() === emailToCheck
                                ) || groupsProfiles.find(p => 
                                  p.email?.toLowerCase() === emailToCheck
                                )
                                
                                setDuplicateAccount(existingAccount)
                                setDuplicateAccountProfile(profile || null)
                                setError('Este email já está cadastrado!')
                                return // Não salva
                              }
                            } else {
                              // Ao editar, verificar se o email mudou e se já existe em outra conta
                              const emailToCheck = newAccount.email.trim().toLowerCase()
                              const currentAccount = accounts[editingAccountIndex]
                              
                              // Se o email mudou, verificar se já existe
                              if (currentAccount.email.toLowerCase() !== emailToCheck) {
                                const existingAccount = accounts.find((acc, idx) => 
                                  idx !== editingAccountIndex && acc.email.toLowerCase() === emailToCheck
                                )
                                
                                if (existingAccount) {
                                  // Encontrar perfil correspondente
                                  const profile = profiles.find(p => 
                                    p.email?.toLowerCase() === emailToCheck
                                  ) || historyProfiles.find(p => 
                                    p.email?.toLowerCase() === emailToCheck
                                  ) || groupsProfiles.find(p => 
                                    p.email?.toLowerCase() === emailToCheck
                                  )
                                  
                                  setDuplicateAccount(existingAccount)
                                  setDuplicateAccountProfile(profile || null)
                                  setError('Este email já está cadastrado em outra conta!')
                                  return // Não salva
                                }
                              }
                            }
                            
                            // Limpar dados de duplicata se passou na validação
                            setDuplicateAccount(null)
                            setDuplicateAccountProfile(null)
                            
                            // Gerar ID automaticamente por incremento numérico
                            let finalId = ''
                            if (editingAccountIndex === null) {
                              // Nova conta - usar o próximo ID sequencial baseado na quantidade de contas
                              finalId = String(accounts.length + 1)
                            } else {
                              // Editando conta - manter o ID existente
                              finalId = accounts[editingAccountIndex].id || ''
                            }
                            
                            // Processar cel - se vazio, salvar como "n/a"
                            const celValue = newAccount.cel && newAccount.cel.trim() !== '' ? newAccount.cel : 'n/a'
                            
                            // Criar objeto da conta - nome inicia como "n/a" para novas contas
                            const existingAccount = editingAccountIndex !== null ? accounts[editingAccountIndex] : null
                            
                            // Processar URL - usar o valor digitado (já validado acima)
                            const urlToSave = newAccount.url.trim()
                            
                            // Processar name - usar o valor digitado, ou manter existente se vazio ao editar
                            const nameValue = editingAccountIndex === null 
                              ? (newAccount.name && newAccount.name.trim() !== '' ? newAccount.name : 'n/a')
                              : (newAccount.name && newAccount.name.trim() !== '' ? newAccount.name : (existingAccount?.name || 'n/a'))
                            
                            // Processar note - manter o valor digitado ou vazio
                            const noteValue = newAccount.note && newAccount.note.trim() !== '' ? newAccount.note.trim() : ''
                            
                            const accountToSave: AccountData = {
                              ...newAccount,
                              id: finalId,
                              email: newAccount.email.trim(),
                              password: newAccount.password.trim(),
                              url: urlToSave,
                              cel: celValue,
                              name: nameValue,
                              number: newAccount.number ? newAccount.number.trim() : '',
                              note: noteValue
                            }
                            
                            if (editingAccountIndex !== null) {
                              // Editar conta existente
                              const updatedAccounts = [...accounts]
                              
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
                                setUrlsOriginal(updatedUrls) // Atualizar URLs originais também
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
                            
                            setNewAccount({ id: '', email: '', password: '', url: '', number: '', cel: '', name: '', note: '' })
                            setShowAddAccount(false)
                            setError(null)
                            setDuplicateAccount(null)
                            setDuplicateAccountProfile(null)
                          }}
                          className="btn-new btn-success-new flex-1"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setShowAddAccount(false)
                            setEditingAccountIndex(null)
                            setNewAccount({ id: '', email: '', password: '', url: '', number: '', cel: '', name: '', note: '' })
                            setError(null)
                            setDuplicateAccount(null)
                            setDuplicateAccountProfile(null)
                          }}
                          className="btn-new btn-secondary-new flex-1"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Modal de Erro - Email Duplicado */}
                {duplicateAccount && (
                  <div className="modal-overlay">
                    <div className="modal-content max-w-md">
                      <div className="mb-6">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                            <span className="text-2xl">⚠️</span>
                          </div>
                          <div>
                            <h3 className="text-xl font-bold text-gray-800">Email Já Cadastrado</h3>
                            <p className="text-sm text-gray-600">Este email já está em uso</p>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-4">
                            {/* Foto do Perfil */}
                            <div className="flex-shrink-0">
                              {duplicateAccountProfile?.avatar ? (
                                <img
                                  src={duplicateAccountProfile.avatar}
                                  alt={duplicateAccount.name || duplicateAccount.email}
                                  className="w-16 h-16 rounded-full border-2 border-purple-400 object-cover"
                                  onError={(e) => {
                                    e.currentTarget.style.display = 'none'
                                  }}
                                />
                              ) : (
                                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-purple-400 flex items-center justify-center">
                                  <span className="text-2xl text-white font-bold">
                                    {(duplicateAccount.name || duplicateAccount.email || '?')[0]?.toUpperCase()}
                                  </span>
                                </div>
                              )}
                            </div>
                            
                            {/* Dados da Conta */}
                            <div className="flex-1 min-w-0">
                              <div className="font-bold text-gray-800 text-lg mb-1 truncate">
                                {duplicateAccount.name || 'N/A'}
                              </div>
                              <div className="text-sm text-gray-600 truncate mb-2">
                                {duplicateAccount.email}
                              </div>
                              {duplicateAccount.id && (
                                <div className="text-xs text-gray-500 font-mono">
                                  ID: {duplicateAccount.id}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <button
                          onClick={() => {
                            setDuplicateAccount(null)
                            setDuplicateAccountProfile(null)
                            setError(null)
                          }}
                          className="btn-new btn-primary-new flex-1"
                        >
                          Entendi
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
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Nota</th>
                        <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {accounts.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
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
                              
                              // Reajustar IDs sequencialmente (1, 2, 3, ...)
                              const reindexedAccounts = updatedAccounts.map((acc, idx) => ({
                                ...acc,
                                id: String(idx + 1)
                              }))
                              
                              setAccounts(reindexedAccounts)
                              
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
                                setUrlsOriginal(updatedUrls) // Atualizar URLs originais também
                                await saveUrls(updatedUrls)
                              }
                              
                              // Salvar contas com IDs reajustados
                              try {
                                await fetch('/api/accounts', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ accounts: reindexedAccounts }),
                                })
                              } catch (e) {
                                console.error('Erro ao salvar contas:', e)
                              }
                            }
                          }

                          // Verificar se a conta não tem URL do Kwai
                          const hasNoUrl = !account.url || account.url.trim() === ''
                          
                          return (
                            <tr key={index} className={`border-b hover:bg-gray-50 ${hasNoUrl ? 'border-l-4 border-red-500' : ''}`}>
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
                                {account.note ? (
                                  <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-semibold">
                                    {account.note}
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-xs">-</span>
                                )}
                              </td>
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
                                        cel: account.cel || '',
                                        name: account.name || '',
                                        note: account.note || ''
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
                <h2 className="text-2xl font-bold text-gray-800 mb-6">📅 Calendário</h2>
                
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
                  <h2 className="text-2xl font-bold text-gray-800">🔗 URLs ({urls.filter((_, idx) => !urlsProcessed.has(idx)).length}/{urls.length})</h2>
                  <button
                    onClick={() => {
                      setUrlsProcessed(new Set())
                      // Restaurar URLs originais se existirem, senão usar as URLs atuais
                      if (urlsOriginal.length > 0) {
                        setUrls(urlsOriginal)
                      }
                    }}
                    className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition-all"
                  >
                    🔄 Reiniciar
                  </button>
                </div>

                {/* Formulário para adicionar nova URL */}
                <div className="mb-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newUrl}
                      onChange={(e) => setNewUrl(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          handleAddUrl()
                        }
                      }}
                      placeholder="Digite a URL do perfil Kwai..."
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    />
                    <button
                      onClick={handleAddUrl}
                      className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md"
                    >
                      ➕ Adicionar
                    </button>
                  </div>
                  {error && (
                    <p className="mt-2 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Lista de URLs */}
                <div className="max-h-[calc(100vh-300px)] overflow-y-auto space-y-2">
                  {urls.map((url, index) => {
                    // Pular URLs processadas
                    if (urlsProcessed.has(index)) {
                      return null
                    }
                    
                    // Buscar perfil correspondente para obter a foto
                    const profile = profiles.find(p => p.url === url)
                    const avatar = profile?.avatar || ''
                    const displayName = cleanDisplayName(profile?.displayName || profile?.name || '')
                    
                    // Calcular número real (sem contar as processadas)
                    const realIndex = urls.slice(0, index).filter((_, idx) => !urlsProcessed.has(idx)).length + 1
                    
                    return (
                      <div
                        key={index}
                    onClick={async () => {
                      // Copiar URL para clipboard
                      try {
                        await navigator.clipboard.writeText(url)
                        // Marcar como processada
                        setUrlsProcessed(prev => {
                          const newSet = new Set(prev)
                          newSet.add(index)
                          return newSet
                        })
                      } catch (e) {
                        console.error('Erro ao copiar URL:', e)
                        // Mesmo com erro, marcar como processada
                        setUrlsProcessed(prev => {
                          const newSet = new Set(prev)
                          newSet.add(index)
                          return newSet
                        })
                      }
                    }}
                        className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-purple-50 hover:border-purple-300 border border-transparent transition-all cursor-pointer group"
                      >
                        <span className="text-sm text-gray-500 w-8">{realIndex}.</span>
                        
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

                        {/* Botão de deletar */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation() // Evitar que o clique no botão dispare o onClick do div
                            if (window.confirm(`Tem certeza que deseja deletar esta URL?\n\n${url}`)) {
                              handleRemoveUrl(index)
                            }
                          }}
                          className="flex-shrink-0 px-3 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                          title="Deletar URL"
                        >
                          🗑️
                        </button>
                      </div>
                    )
                  })}
                  {urls.filter((_, idx) => !urlsProcessed.has(idx)).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {urls.length === 0 ? 'Nenhuma URL cadastrada.' : 'Todas as URLs foram processadas. Clique em "Reiniciar" para voltar.'}
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
                    <div className="flex items-center justify-between mb-8">
                      <div className="text-center flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2">Selecione um Grupo</h3>
                        <p className="text-gray-600">Escolha uma faixa de seguidores ou grupo personalizado para visualizar as contas</p>
                      </div>
                      <button
                        onClick={() => setShowCreateGroupModal(true)}
                        className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-md flex items-center gap-2"
                      >
                        <span>➕</span>
                        <span>Criar Grupo</span>
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                      {/* Grupos Personalizados */}
                      {Object.entries(getCustomGroupsWithProfiles())
                        .map(([groupName, accounts]) => {
                          const totalFollowers = accounts.reduce((sum, acc) => {
                            return sum + parseFollowers(acc.followers || '0')
                          }, 0)
                          const groupData = customGroups[groupName]
                          const coverImage = groupCovers[`custom-${groupName}`] || groupData?.coverImage || ''
                          
                          return (
                            <div
                              key={`custom-${groupName}`}
                              className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl border border-gray-200 hover:border-purple-400"
                              onClick={() => setSelectedGroup(`custom-${groupName}`)}
                            >
                              {/* Capa do Grupo */}
                              <div className="relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 overflow-hidden">
                                {coverImage ? (
                                  <img 
                                    src={coverImage} 
                                    alt={groupName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-4xl text-white opacity-80">👥</span>
                                  </div>
                                )}
                                {/* Overlay com gradiente */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                {/* Botão de editar capa */}
                                 <button
                                   onClick={(e) => {
                                     e.stopPropagation()
                                     setEditingGroupCover(`custom-${groupName}`)
                                     setGroupCoverImage(groupCovers[`custom-${groupName}`] || groupData?.coverImage || '')
                                     setEditingGroupName(groupName)
                                   }}
                                   className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                 >
                                   <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                   </svg>
                                 </button>
                              </div>
                              
                              {/* Conteúdo do Card */}
                              <div className="p-5">
                                <div className="text-center">
                                  <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                    {groupName}
                                  </h3>
                                  <div className="flex items-center justify-center gap-4 mt-3">
                                    <div>
                                      <div className="text-2xl font-bold text-gray-800">
                                        {accounts.length}
                                      </div>
                                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">contas</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-300"></div>
                                    <div>
                                      <div className="text-2xl font-bold text-gray-800">
                                        {(totalFollowers / 1000).toFixed(1)}K
                                      </div>
                                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">seguidores</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                      {/* Grupos Originais (por seguidores) */}
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
                          const coverImage = groupCovers[groupName] || ''
                          
                          return (
                            <div
                              key={groupName}
                              className="group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl border border-gray-200 hover:border-purple-400"
                              onClick={() => setSelectedGroup(groupName)}
                            >
                              {/* Capa do Grupo */}
                              <div className="relative h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 overflow-hidden">
                                {coverImage ? (
                                  <img 
                                    src={coverImage} 
                                    alt={groupName}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center">
                                    <span className="text-5xl text-white opacity-90">
                                      {groupName === 'inicio' ? '🚀' : '⭐'}
                                    </span>
                                  </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                <div className="absolute bottom-3 left-3 right-3">
                                  <div className="text-2xl font-black text-white drop-shadow-lg">
                                    {groupName === 'inicio' ? '< 1k' : groupName.toUpperCase()}
                                  </div>
                                </div>
                                {/* Botão de editar capa */}
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setEditingGroupCover(groupName)
                                    setGroupCoverImage(coverImage)
                                  }}
                                  className="absolute top-2 right-2 p-2 bg-black/50 hover:bg-black/70 rounded-lg backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
                                >
                                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                  </svg>
                                </button>
                              </div>
                              
                              {/* Conteúdo do Card */}
                              <div className="p-5">
                                <div className="text-center">
                                  <div className="flex items-center justify-center gap-4 mt-2">
                                    <div>
                                      <div className="text-2xl font-bold text-gray-800">
                                        {accounts.length}
                                      </div>
                                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">contas</div>
                                    </div>
                                    <div className="w-px h-8 bg-gray-300"></div>
                                    <div>
                                      <div className="text-2xl font-bold text-gray-800">
                                        {(totalFollowers / 1000).toFixed(1)}K
                                      </div>
                                      <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">seguidores</div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )
                        })}
                    </div>
                    {Object.keys(groupedAccounts()).length === 0 && Object.keys(getCustomGroupsWithProfiles()).length === 0 && (
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
                      <div className={`rounded-xl px-8 py-4 text-white shadow-lg ${
                        selectedGroup.startsWith('custom-') 
                          ? 'bg-gradient-to-r from-purple-600 to-pink-600' 
                          : 'bg-gradient-to-r from-purple-600 to-pink-600'
                      }`}>
                        <div className="text-xs font-medium opacity-90 mb-1 uppercase tracking-wide">Grupo Selecionado</div>
                        <div className="text-3xl font-black">
                          {selectedGroup.startsWith('custom-') 
                            ? selectedGroup.replace('custom-', '') 
                            : (selectedGroup === 'inicio' ? '< 1k' : selectedGroup.toUpperCase())}
                        </div>
                        <div className="text-xs opacity-80 mt-2 font-medium">
                          {selectedGroup.startsWith('custom-') 
                            ? (getCustomGroupsWithProfiles()[selectedGroup.replace('custom-', '')]?.length || 0)
                            : (groupedAccounts()[selectedGroup]?.length || 0)} conta(s) neste grupo
                        </div>
                      </div>
                      {selectedGroup.startsWith('custom-') && (
                        <button
                          onClick={async () => {
                            const groupName = selectedGroup.replace('custom-', '')
                            if (!confirm(`Tem certeza que deseja remover o grupo "${groupName}"? As contas voltarão para seus grupos originais.`)) {
                              return
                            }
                            
                            const newCustomGroups = { ...customGroups }
                            delete newCustomGroups[groupName]
                            
                            setCustomGroups(newCustomGroups)
                            setSelectedGroup(null)
                            
                            // Salvar no servidor
                            try {
                              await fetch('/api/custom-groups', {
                                method: 'POST',
                                headers: { 'Content-Type': 'application/json' },
                                body: JSON.stringify({ 
                                  customGroups: newCustomGroups,
                                  accountGroups: accountGroups
                                }),
                              })
                            } catch (e) {
                              console.error('Erro ao salvar grupos:', e)
                              alert('Erro ao remover grupo. Tente novamente.')
                            }
                          }}
                          className="px-5 py-2.5 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-all shadow-md flex items-center gap-2"
                        >
                          <span>🗑️</span>
                          <span>Remover Grupo</span>
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {(selectedGroup.startsWith('custom-') 
                        ? getCustomGroupsWithProfiles()[selectedGroup.replace('custom-', '')] || []
                        : groupedAccounts()[selectedGroup] || []
                      ).map((profile, index) => {
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
                        
                        return (
                          <div
                            key={index}
                            className="group bg-white rounded-2xl p-6 border-2 border-gray-200 transition-all duration-200"
                          >
                            <div className="space-y-4">
                              {/* Avatar e Nome */}
                              <div className="flex items-center gap-4">
                                {profile.avatar ? (
                                  <img
                                    src={profile.avatar}
                                    alt={displayName}
                                    className="w-20 h-20 rounded-2xl border-[3px] border-purple-400 object-cover flex-shrink-0 shadow-lg"
                                    onError={(e) => {
                                      e.currentTarget.style.display = 'none'
                                    }}
                                  />
                                ) : (
                                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-purple-400 to-pink-400 border-[3px] border-purple-400 flex items-center justify-center flex-shrink-0 shadow-lg">
                                    <span className="text-3xl text-white font-bold">
                                      {displayName[0]?.toUpperCase() || '?'}
                                    </span>
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <div className="font-bold text-gray-800 truncate text-lg mb-1">
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
                              
                              {/* Botão Ver Perfil */}
                              {kwaiUrl && (
                                <div className="pt-2">
                                  <button
                                    onClick={() => window.open(kwaiUrl, '_blank')}
                                    className="w-full text-xs px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                                  >
                                    👁️ Ver Perfil
                                  </button>
                                </div>
                              )}
                              
                              {/* Botão para remover de grupo personalizado ou mover para outro */}
                              {selectedGroup.startsWith('custom-') && profile.email && (
                                <div className="pt-2">
                                  <button
                                    onClick={async () => {
                                      if (!profile.email) return
                                      
                                      const profileEmail = profile.email.toLowerCase()
                                      const groupName = selectedGroup.replace('custom-', '')
                                      
                                      const newCustomGroups = { ...customGroups }
                                      if (newCustomGroups[groupName]?.emails) {
                                        newCustomGroups[groupName].emails = newCustomGroups[groupName].emails.filter(
                                          email => email.toLowerCase() !== profileEmail
                                        )
                                      }
                                      
                                      setCustomGroups(newCustomGroups)
                                      
                                      // Salvar no servidor
                                      try {
                                        await fetch('/api/custom-groups', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ 
                                            customGroups: newCustomGroups,
                                            accountGroups: accountGroups,
                                            groupCovers: groupCovers
                                          }),
                                        })
                                      } catch (e) {
                                        console.error('Erro ao salvar grupos:', e)
                                      }
                                    }}
                                    className="w-full text-xs px-2 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                  >
                                    Remover do grupo (volta para grupo original)
                                  </button>
                                </div>
                              )}
                              {/* Botão para mover para grupo personalizado */}
                              {!selectedGroup.startsWith('custom-') && profile.email && (
                                <div className="pt-2">
                                  <select
                                    onChange={async (e) => {
                                      const targetGroup = e.target.value
                                      if (!targetGroup || !profile.email) {
                                        e.target.value = ''
                                        return
                                      }
                                      
                                      // Se selecionou criar novo grupo, abrir modal
                                      if (targetGroup === '__create__') {
                                        setNewGroupName('')
                                        setPendingMoveEmail(profile.email.toLowerCase())
                                        setShowCreateGroupModal(true)
                                        // Resetar select
                                        e.target.value = ''
                                        return
                                      }
                                      
                                      const profileEmail = profile.email.toLowerCase()
                                      
                                      // Remover de todos os grupos personalizados primeiro
                                      const newCustomGroups = { ...customGroups }
                                      Object.keys(newCustomGroups).forEach(groupName => {
                                        if (newCustomGroups[groupName]?.emails) {
                                          newCustomGroups[groupName].emails = newCustomGroups[groupName].emails.filter(
                                            email => email.toLowerCase() !== profileEmail
                                          )
                                        }
                                      })
                                      
                                      // Adicionar ao grupo selecionado
                                      if (targetGroup !== '') {
                                        if (!newCustomGroups[targetGroup]) {
                                          newCustomGroups[targetGroup] = { emails: [], coverImage: '' }
                                        }
                                        if (!newCustomGroups[targetGroup].emails.includes(profileEmail)) {
                                          newCustomGroups[targetGroup].emails.push(profileEmail)
                                        }
                                      }
                                      
                                      setCustomGroups(newCustomGroups)
                                      
                                      // Salvar no servidor
                                      try {
                                        await fetch('/api/custom-groups', {
                                          method: 'POST',
                                          headers: { 'Content-Type': 'application/json' },
                                          body: JSON.stringify({ 
                                            customGroups: newCustomGroups,
                                            accountGroups: accountGroups,
                                            groupCovers: groupCovers
                                          }),
                                        })
                                      } catch (e) {
                                        console.error('Erro ao salvar grupos:', e)
                                      }
                                      
                                      // Resetar select
                                      e.target.value = ''
                                    }}
                                    className="w-full text-xs px-2 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                    defaultValue=""
                                  >
                                    <option value="">Mover para grupo...</option>
                                    {Object.keys(customGroups).map(groupName => (
                                      <option key={groupName} value={groupName}>{groupName}</option>
                                    ))}
                                    <option value="__create__">➕ Criar novo grupo</option>
                                  </select>
                                </div>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    {((selectedGroup.startsWith('custom-') 
                        ? (getCustomGroupsWithProfiles()[selectedGroup.replace('custom-', '')]?.length || 0) === 0
                        : (!groupedAccounts()[selectedGroup] || groupedAccounts()[selectedGroup].length === 0))) && (
                      <div className="text-center py-12 text-gray-500">
                        Nenhuma conta neste grupo.
                      </div>
                    )}
                  </div>
                )}
                
                {/* Modal para Criar Grupo */}
                {showCreateGroupModal && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">Criar Novo Grupo</h3>
                      <input
                        type="text"
                        value={newGroupName}
                        onChange={(e) => setNewGroupName(e.target.value)}
                        placeholder="Nome do grupo (ex: meta, vip, etc)"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 mb-4"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && newGroupName.trim()) {
                            handleCreateGroup()
                          }
                        }}
                        autoFocus
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={handleCreateGroup}
                          disabled={!newGroupName.trim()}
                          className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Criar
                        </button>
                        <button
                          onClick={() => {
                            setShowCreateGroupModal(false)
                            setNewGroupName('')
                            setPendingMoveEmail(null)
                          }}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Modal para Editar Capa do Grupo */}
                {editingGroupCover && (
                  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                      <h3 className="text-xl font-bold text-gray-800 mb-4">
                        Editar {editingGroupCover.startsWith('custom-') ? 'Grupo' : 'Capa'}: {editingGroupCover.startsWith('custom-') 
                          ? editingGroupCover.replace('custom-', '') 
                          : (editingGroupCover === 'inicio' ? '< 1k' : editingGroupCover.toUpperCase())}
                      </h3>
                      
                      {/* Campo para editar nome (apenas grupos personalizados) */}
                      {editingGroupCover.startsWith('custom-') && (
                        <div className="mb-4">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nome do Grupo:
                          </label>
                          <input
                            type="text"
                            value={editingGroupName}
                            onChange={(e) => setEditingGroupName(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            placeholder="Nome do grupo"
                          />
                        </div>
                      )}
                      
                      <label className="block mb-4">
                        <span className="block text-sm font-medium text-gray-700 mb-2">Escolher imagem do PC:</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileSelect}
                          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100 cursor-pointer"
                        />
                      </label>
                      {groupCoverImage && (
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 mb-2">Preview:</p>
                          <img 
                            src={groupCoverImage} 
                            alt="Preview"
                            className="w-full h-32 object-cover rounded-lg border border-gray-300"
                            onError={(e) => {
                              e.currentTarget.style.display = 'none'
                            }}
                          />
                        </div>
                      )}
                      <div className="flex gap-3">
                        <button
                          onClick={handleSaveGroupCover}
                          className="flex-1 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => {
                            setEditingGroupCover(null)
                            setGroupCoverImage('')
                            setEditingGroupName('')
                          }}
                          className="flex-1 px-4 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition-all"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
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
                        [today]: { groups: {}, calendarMarked: false }
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
                  const todayData = dailyPosting[today] || { groups: {}, calendarMarked: false }
                  
                  // Se não há grupo selecionado, mostrar cards dos grupos
                  if (!dailyPostingGroup) {
                    return (
                      <>
                        <div className="mb-6">
                          <h3 className="text-xl font-bold text-gray-800 mb-4">Selecione um Grupo</h3>
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                            {/* Grupos Personalizados */}
                            {Object.keys(customGroups).length > 0 && Object.keys(customGroups).map((groupName) => {
                              const accounts = getCustomGroupsWithProfiles()[groupName] || []
                              const totalFollowers = accounts.reduce((sum, acc) => {
                                return sum + parseFollowers(acc.followers || '0')
                              }, 0)
                              const groupData = customGroups[groupName]
                              const coverImage = groupCovers[`custom-${groupName}`] || groupData?.coverImage || ''
                              
                              // Verificar se o grupo está completo
                              const groupKey = `custom-${groupName}`
                              const groupTodayData = todayData.groups[groupKey] || { selected: [] }
                              const isGroupCompleted = groupTodayData.selected.length === accounts.length && accounts.length > 0
                              
                              return (
                                  <div
                                    key={`custom-${groupName}`}
                                    onClick={() => setDailyPostingGroup(`custom-${groupName}`)}
                                    className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl ${
                                      isGroupCompleted 
                                        ? 'ring-4 ring-green-400 ring-opacity-60 shadow-green-200' 
                                        : 'border border-gray-200 hover:border-purple-400'
                                    }`}
                                  >
                                    {/* Capa do Grupo */}
                                    <div className={`relative h-32 bg-gradient-to-br from-purple-500 via-pink-500 to-purple-600 overflow-hidden ${isGroupCompleted ? 'opacity-90' : ''}`}>
                                      {coverImage ? (
                                        <img 
                                          src={coverImage} 
                                          alt={groupName}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <span className="text-4xl text-white opacity-80">👥</span>
                                        </div>
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                      {isGroupCompleted && (
                                        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px]"></div>
                                      )}
                                    </div>
                                    
                                    {/* Conteúdo do Card */}
                                    <div className={`p-5 ${isGroupCompleted ? 'bg-gradient-to-b from-green-50/50 to-white' : ''}`}>
                                      <div className="text-center">
                                        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">
                                          {groupName}
                                        </h3>
                                        <div className="flex items-center justify-center gap-4 mt-3">
                                          <div>
                                            <div className="text-2xl font-bold text-gray-800">
                                              {accounts.length}
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">contas</div>
                                          </div>
                                          <div className="w-px h-8 bg-gray-300"></div>
                                          <div>
                                            <div className="text-2xl font-bold text-gray-800">
                                              {(totalFollowers / 1000).toFixed(1)}K
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">seguidores</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                            {/* Grupos Originais (por seguidores) */}
                            {Object.entries(groupedAccounts())
                              .sort((a, b) => {
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
                                const coverImage = groupCovers[groupName] || ''
                                
                                // Verificar se o grupo está completo
                                const groupTodayData = todayData.groups[groupName] || { selected: [] }
                                const isGroupCompleted = groupTodayData.selected.length === accounts.length && accounts.length > 0
                                
                                return (
                                  <div
                                    key={groupName}
                                    onClick={() => setDailyPostingGroup(groupName)}
                                    className={`group relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 shadow-lg hover:shadow-2xl ${
                                      isGroupCompleted 
                                        ? 'ring-4 ring-green-400 ring-opacity-60 shadow-green-200' 
                                        : 'border border-gray-200 hover:border-purple-400'
                                    }`}
                                  >
                                    {/* Capa do Grupo */}
                                    <div className={`relative h-32 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 overflow-hidden ${isGroupCompleted ? 'opacity-90' : ''}`}>
                                      {coverImage ? (
                                        <img 
                                          src={coverImage} 
                                          alt={groupName}
                                          className="w-full h-full object-cover"
                                          onError={(e) => {
                                            e.currentTarget.style.display = 'none'
                                          }}
                                        />
                                      ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                          <span className="text-5xl text-white opacity-90">
                                            {groupName === 'inicio' ? '🚀' : '⭐'}
                                          </span>
                                        </div>
                                      )}
                                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                                      {isGroupCompleted && (
                                        <div className="absolute inset-0 bg-green-500/20 backdrop-blur-[1px]"></div>
                                      )}
                                      <div className="absolute bottom-3 left-3 right-3">
                                        <div className="text-2xl font-black text-white drop-shadow-lg">
                                          {groupName === 'inicio' ? '< 1k' : groupName.toUpperCase()}
                                        </div>
                                      </div>
                                    </div>
                                    
                                    {/* Conteúdo do Card */}
                                    <div className={`p-5 ${isGroupCompleted ? 'bg-gradient-to-b from-green-50/50 to-white' : ''}`}>
                                      <div className="text-center">
                                        <div className="flex items-center justify-center gap-4 mt-2">
                                          <div>
                                            <div className="text-2xl font-bold text-gray-800">
                                              {accounts.length}
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">contas</div>
                                          </div>
                                          <div className="w-px h-8 bg-gray-300"></div>
                                          <div>
                                            <div className="text-2xl font-bold text-gray-800">
                                              {(totalFollowers / 1000).toFixed(1)}K
                                            </div>
                                            <div className="text-xs text-gray-500 uppercase tracking-wide font-semibold">seguidores</div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                )
                              })}
                          </div>
                          {Object.keys(groupedAccounts()).length === 0 && Object.keys(getCustomGroupsWithProfiles()).length === 0 && (
                            <div className="text-center py-12 text-gray-500">
                              <p className="text-lg font-medium text-gray-700 mb-2">Nenhum grupo disponível</p>
                              <p className="text-sm">Execute a análise primeiro ou selecione um histórico.</p>
                            </div>
                          )}
                        </div>
                        
                        {/* Histórico sempre visível */}
                        {postingHistory.length > 0 && (
                          <div className="mt-8 pt-6 border-t border-gray-200">
                            <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Histórico de Postagens</h3>
                            <div className="space-y-2 max-h-64 overflow-y-auto">
                              {postingHistory.map((item, index) => {
                                const formatDate = (dateStr: string): string => {
                                  if (!dateStr) return ''
                                  const parts = dateStr.split('-')
                                  if (parts.length === 3) {
                                    return `${parts[2]}/${parts[1]}/${parts[0]}`
                                  }
                                  const date = new Date(dateStr)
                                  if (!isNaN(date.getTime())) {
                                    return date.toLocaleDateString('pt-BR')
                                  }
                                  return dateStr
                                }
                                
                                const groups = item.groups || []
                                const groupsDisplay = groups.map(g => {
                                  if (g.startsWith('custom-')) {
                                    return g.replace('custom-', '')
                                  }
                                  return g === 'inicio' ? '< 1k' : g.toUpperCase()
                                }).join(' | ')
                                
                                return (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                  >
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-800">
                                        {formatDate(item.date)}
                                      </div>
                                      {groupsDisplay && (
                                        <div className="text-sm font-medium text-purple-600 mb-1">
                                          {groupsDisplay}
                                        </div>
                                      )}
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
                                            const newHistory = postingHistory.filter((_, i) => i !== index)
                                            setPostingHistory(newHistory)
                                            
                                            // Desmarcar calendário e resetar grupos do dia
                                            if (itemToRemove && itemToRemove.date) {
                                              const dateToCheck = itemToRemove.date
                                              
                                              // Verificar se há outros itens desse dia
                                              const hasOtherItemsOnSameDate = newHistory.some(item => item.date === dateToCheck)
                                              
                                              // Se não há mais itens desse dia, desmarcar calendário
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
                                              
                                              // Resetar grupos do dia para 0%
                                              const newDailyPosting = { ...dailyPosting }
                                              if (newDailyPosting[dateToCheck]) {
                                                newDailyPosting[dateToCheck] = { groups: {}, calendarMarked: false }
                                                setDailyPosting(newDailyPosting)
                                                
                                                try {
                                                  await fetch('/api/daily-posting', {
                                                    method: 'POST',
                                                    headers: { 'Content-Type': 'application/json' },
                                                    body: JSON.stringify({ postingData: newDailyPosting }),
                                                  })
                                                } catch (e) {
                                                  console.error('Erro ao resetar grupos:', e)
                                                }
                                              }
                                            }
                                            
                                            // Recarregar histórico do servidor
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
                  }
                  
                  // Obter contas do grupo selecionado
                  let groupProfiles: ProfileData[] = []
                  let groupDisplayName = ''
                  
                  if (dailyPostingGroup.startsWith('custom-')) {
                    const groupName = dailyPostingGroup.replace('custom-', '')
                    groupProfiles = getCustomGroupsWithProfiles()[groupName] || []
                    groupDisplayName = groupName
                  } else {
                    groupProfiles = groupedAccounts()[dailyPostingGroup] || []
                    groupDisplayName = dailyPostingGroup === 'inicio' ? '< 1k' : dailyPostingGroup.toUpperCase()
                  }
                  
                  // Dados do grupo para hoje
                  const groupData = todayData.groups[dailyPostingGroup] || { selected: [] }
                  const selectedCount = groupData.selected.length
                  const totalAccounts = groupProfiles.length
                  const isGroupCompleted = selectedCount === totalAccounts && totalAccounts > 0
                  const remaining = totalAccounts - selectedCount
                  
                  return (
                    <>
                      {/* Botão Voltar */}
                      <div className="mb-6">
                        <button
                          onClick={() => setDailyPostingGroup(null)}
                          className="px-5 py-2.5 bg-white rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors shadow-sm border border-gray-300 hover:border-purple-400 flex items-center gap-2"
                        >
                          <span>←</span>
                          <span>Voltar para Grupos</span>
                        </button>
                      </div>
                      
                      {isGroupCompleted ? (
                        <div className="bg-green-50 border-2 border-green-500 rounded-lg p-6 mb-6">
                          <div className="text-center">
                            <div className="text-3xl mb-2">✅</div>
                            <h3 className="text-xl font-bold text-green-800 mb-2">Grupo Concluído!</h3>
                            <p className="text-green-700 mb-4">
                              Todas as {totalAccounts} contas do grupo <strong>{groupDisplayName}</strong> foram processadas.
                            </p>
                            {groupData.startTime && groupData.endTime && (
                              <div className="mt-4 text-sm text-green-700">
                                <div>🕐 Início: {new Date(groupData.startTime).toLocaleTimeString('pt-BR')}</div>
                                <div>🕐 Fim: {new Date(groupData.endTime).toLocaleTimeString('pt-BR')}</div>
                              </div>
                            )}
                          </div>
                        </div>
                      ) : (
                        <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mb-6">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-700">
                              Grupo: <strong>{groupDisplayName}</strong> • Progresso: {selectedCount} / {totalAccounts}
                            </span>
                            <span className="text-sm text-gray-600">Faltam {remaining}</span>
                          </div>

                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-300"
                              style={{ width: `${totalAccounts > 0 ? (selectedCount / totalAccounts) * 100 : 0}%` }}
                            ></div>
                          </div>
                          {groupData.startTime && (
                            <div className="mt-2 text-sm text-gray-600">
                              🕐 Início: {new Date(groupData.startTime).toLocaleTimeString('pt-BR')}
                            </div>
                          )}
                        </div>
                      )}

                      <div className="space-y-2 max-h-96 overflow-y-auto">
                        {groupProfiles.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <p className="text-sm font-semibold">Nenhuma conta disponível neste grupo.</p>
                          </div>
                        ) : isGroupCompleted ? (
                          <div className="text-center py-8 text-green-500">
                            <p className="text-sm font-semibold">✅ Todas as contas deste grupo já foram selecionadas!</p>
                          </div>
                        ) : (
                          groupProfiles
                            .filter((profile) => !groupData.selected.includes(profile.email?.toLowerCase() || ''))
                            .map((profile, index) => {
                            const accountProfile = profiles.find(p => p.email === profile.email) || historyProfiles.find(p => p.email === profile.email) || profile
                            
                            const handleClick = async () => {
                              if (isGroupCompleted) return

                              const profileEmail = (profile.email || '').toLowerCase()
                              const newSelected = [...groupData.selected, profileEmail]
                              
                              const now = new Date().toISOString()
                              const isGroupComplete = newSelected.length === totalAccounts
                              
                              const newGroupData = {
                                selected: newSelected,
                                startTime: newSelected.length === 1 && !groupData.startTime ? now : groupData.startTime,
                                endTime: isGroupComplete ? now : groupData.endTime
                              }
                              
                              const newTodayData = {
                                ...todayData,
                                groups: {
                                  ...todayData.groups,
                                  [dailyPostingGroup]: newGroupData
                                }
                              }

                              const newDailyPosting = {
                                ...dailyPosting,
                                [today]: newTodayData
                              }

                              setDailyPosting(newDailyPosting)

                              if (profile.email) {
                                try {
                                  await navigator.clipboard.writeText(profile.email)
                                } catch (e) {
                                  console.error('Erro ao copiar email:', e)
                                }
                              }

                              // Se completou o grupo, adicionar ao histórico e marcar calendário
                              if (isGroupComplete && newGroupData.startTime && newGroupData.endTime) {
                                try {
                                  // Normalizar a data de hoje para comparação (YYYY-MM-DD)
                                  const todayDateStr = today
                                  
                                  // Buscar histórico existente para hoje - normalizar datas para comparação
                                  const existingHistoryIndex = postingHistory.findIndex(item => {
                                    if (!item.date) return false
                                    // Normalizar data do item (pode estar em formato ISO ou YYYY-MM-DD)
                                    const itemDateNormalized = item.date.includes('T') 
                                      ? item.date.split('T')[0] 
                                      : item.date.split(' ')[0] // Caso tenha hora sem T
                                    return itemDateNormalized === todayDateStr
                                  })
                                  
                                  let requestBody: any = { postingData: newDailyPosting }
                                  
                                  if (existingHistoryIndex >= 0) {
                                    // SEMPRE atualizar histórico existente - adicionar grupo
                                    const existing = postingHistory[existingHistoryIndex]
                                    const groups = [...(existing.groups || [])]
                                    if (!groups.includes(dailyPostingGroup)) {
                                      groups.push(dailyPostingGroup)
                                    }
                                    
                                    requestBody.updateHistory = {
                                      index: existingHistoryIndex,
                                      groups: groups,
                                      totalAccounts: (existing.totalAccounts || 0) + totalAccounts,
                                      endTime: now
                                    }
                                  } else {
                                    // Criar novo histórico APENAS se não existe nenhum para hoje
                                    requestBody.addToHistory = {
                                      date: today,
                                      startTime: newGroupData.startTime,
                                      endTime: now,
                                      totalAccounts: totalAccounts,
                                      groups: [dailyPostingGroup]
                                    }
                                    
                                    // Marcar calendário apenas se ainda não foi marcado hoje
                                    if (!todayData.calendarMarked) {
                                      const newMarkedDays = { ...markedDays, [today]: true }
                                      setMarkedDays(newMarkedDays)
                                      newTodayData.calendarMarked = true
                                      
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
                                  
                                  const response = await fetch('/api/daily-posting', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify(requestBody),
                                  })
                                  
                                  if (response.ok) {
                                    const responseData = await response.json()
                                    
                                    // SEMPRE recarregar o histórico completo do servidor para evitar duplicatas
                                    // Isso garante que estamos sincronizados com o backend
                                    try {
                                      const historyResponse = await fetch('/api/daily-posting')
                                      if (historyResponse.ok) {
                                        const historyData = await historyResponse.json()
                                        if (historyData.history) {
                                          setPostingHistory(historyData.history)
                                        }
                                      }
                                    } catch (e) {
                                      console.error('Erro ao recarregar histórico:', e)
                                      // Fallback: atualizar localmente apenas se necessário
                                      if (requestBody.updateHistory) {
                                        const updatedHistory = [...postingHistory]
                                        const existingIndex = updatedHistory.findIndex(item => {
                                          if (!item.date) return false
                                          const itemDateNormalized = item.date.includes('T') 
                                            ? item.date.split('T')[0] 
                                            : item.date.split(' ')[0]
                                          return itemDateNormalized === todayDateStr
                                        })
                                        
                                        if (existingIndex >= 0) {
                                          updatedHistory[existingIndex] = {
                                            ...updatedHistory[existingIndex],
                                            groups: requestBody.updateHistory.groups,
                                            totalAccounts: requestBody.updateHistory.totalAccounts,
                                            endTime: requestBody.updateHistory.endTime
                                          }
                                          setPostingHistory(updatedHistory)
                                        }
                                      }
                                    }
                                  }
                                } catch (e) {
                                  console.error('Erro ao salvar postagens:', e)
                                }
                              } else {
                                // Apenas salvar progresso
                                try {
                                  await fetch('/api/daily-posting', {
                                    method: 'POST',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ postingData: newDailyPosting }),
                                  })
                                } catch (e) {
                                  console.error('Erro ao salvar postagens:', e)
                                }
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
                                      alt={profile.name || profile.email || 'Avatar'}
                                      className="w-12 h-12 rounded-full border-2 border-purple-400 object-cover"
                                      onError={(e) => {
                                        e.currentTarget.style.display = 'none'
                                      }}
                                    />
                                  ) : (
                                    <div className="w-12 h-12 rounded-full bg-gray-200 border-2 border-purple-400 flex items-center justify-center">
                                      <span className="text-sm text-purple-600 font-bold">
                                        {(profile.name || profile.email || '?')[0]?.toUpperCase()}
                                      </span>
                                    </div>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="font-semibold text-gray-800 truncate">
                                    {cleanDisplayName(profile.name || profile.displayName || profile.email || 'N/A')}
                                  </div>
                                  <div className="text-sm text-gray-600 truncate">
                                    {profile.email}
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
                              const formatDate = (dateStr: string): string => {
                                if (!dateStr) return ''
                                const parts = dateStr.split('-')
                                if (parts.length === 3) {
                                  return `${parts[2]}/${parts[1]}/${parts[0]}`
                                }
                                const date = new Date(dateStr)
                                if (!isNaN(date.getTime())) {
                                  return date.toLocaleDateString('pt-BR')
                                }
                                return dateStr
                              }
                              
                              const groups = item.groups || []
                              const groupsDisplay = groups.map(g => {
                                if (g.startsWith('custom-')) {
                                  return g.replace('custom-', '')
                                }
                                return g === 'inicio' ? '< 1k' : g.toUpperCase()
                              }).join(', ')
                              
                              return (
                                <div
                                  key={index}
                                  className="flex items-center justify-between p-3 bg-gray-50 border border-gray-200 rounded-lg"
                                >
                                  <div className="flex-1">
                                    <div className="font-semibold text-gray-800">
                                      {formatDate(item.date)}
                                    </div>
                                    {groupsDisplay && (
                                      <div className="text-sm font-medium text-purple-600 mb-1">
                                        {groupsDisplay}
                                      </div>
                                    )}
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
                                          const newHistory = postingHistory.filter((_, i) => i !== index)
                                          setPostingHistory(newHistory)
                                          
                                          // Desmarcar calendário e resetar grupos do dia
                                          if (itemToRemove && itemToRemove.date) {
                                            const dateToCheck = itemToRemove.date
                                            
                                            // Verificar se há outros itens desse dia
                                            const hasOtherItemsOnSameDate = newHistory.some(item => item.date === dateToCheck)
                                            
                                            // Se não há mais itens desse dia, desmarcar calendário
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
                                            
                                            // Resetar grupos do dia para 0%
                                            const newDailyPosting = { ...dailyPosting }
                                            if (newDailyPosting[dateToCheck]) {
                                              newDailyPosting[dateToCheck] = { groups: {}, calendarMarked: false }
                                              setDailyPosting(newDailyPosting)
                                              
                                              try {
                                                await fetch('/api/daily-posting', {
                                                  method: 'POST',
                                                  headers: { 'Content-Type': 'application/json' },
                                                  body: JSON.stringify({ postingData: newDailyPosting }),
                                                })
                                              } catch (e) {
                                                console.error('Erro ao resetar grupos:', e)
                                              }
                                            }
                                          }
                                          
                                          // Recarregar histórico do servidor
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
                      if (catalogConfig.selectedGroups.length === 0) {
                        setError('Selecione pelo menos um grupo')
                        return
                      }
                      
                      setError('')
                      try {
                        const response = await fetch('/api/catalog-config', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({
                            name: 'Contas do Kwai',
                            selectedGroups: catalogConfig.selectedGroups
                          }),
                        })
                        
                        if (response.ok) {
                          const data = await response.json()
                          setCatalogConfig({ selectedGroups: [] })
                          
                          // Recarregar lista de todos os catálogos
                          const listResponse = await fetch('/api/catalog-config')
                          if (listResponse.ok) {
                            const listData = await listResponse.json()
                            setCatalogs(listData.catalogs || [])
                          }
                        } else {
                          const errorData = await response.json()
                          setError(errorData.error || 'Erro ao gerar catálogo')
                        }
                      } catch (e) {
                        console.error('Erro ao gerar catálogo:', e)
                        setError('Erro ao conectar com o servidor')
                      }
                    }}
                    className="w-full px-6 py-3 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-all"
                  >
                    🚀 Gerar
                  </button>
                </div>

                {catalogs.length > 0 && (
                  <div className="mt-8 pt-6 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">📋 Catálogos Gerados</h3>
                    <div className="space-y-3">
                      {catalogs.map((catalog) => {
                        const htmlUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/catalogs/${catalog.link}.html`
                        
                        return (
                          <div
                            key={catalog.link}
                            className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg hover:border-purple-300 transition-colors"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-800 mb-1">{catalog.name}</div>
                              <div className="text-sm text-gray-600 mb-2">
                                Número: <span className="font-bold text-purple-600">{catalog.number}</span>
                                {catalog.selectedGroups && catalog.selectedGroups.length > 0 && (
                                  <span className="ml-2">
                                    • Grupos: {catalog.selectedGroups.join(', ')}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-gray-500 font-mono truncate">
                                {htmlUrl}
                              </div>
                            </div>
                            <div className="flex items-center gap-2 ml-4">
                              <a
                                href={htmlUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-medium"
                              >
                                👁️ Visualizar
                              </a>
                              <button
                                onClick={async () => {
                                  if (!confirm('Tem certeza que deseja remover este catálogo?')) {
                                    return
                                  }
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
                                    }
                                  } catch (e) {
                                    console.error('Erro ao remover catálogo:', e)
                                    setError('Erro ao conectar com o servidor')
                                  }
                                }}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm font-medium"
                              >
                                🗑️ Remover
                              </button>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Valores Tab */}
            {activeTab === 'valores' && (
              <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">💰 Valores por Grupo</h2>
                
                {/* Campo de Taxa */}
                <div className="mb-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <label className="block text-sm font-semibold text-gray-800 mb-2">
                    Taxa (%)
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.01"
                      value={taxa}
                      onChange={(e) => {
                        const newTaxa = parseFloat(e.target.value) || 0
                        setTaxa(newTaxa)
                      }}
                      className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="15.98"
                    />
                    <span className="text-sm text-gray-600">%</span>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6">
                  Configure o valor em reais para cada grupo de seguidores. O sistema calculará automaticamente o total baseado na quantidade de contas em cada grupo.
                </p>
                
                <div className="space-y-4 mb-6">
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
                      <div className="space-y-3">
                        {groupNames.map((groupName) => {
                          const accountCount = groups[groupName].length
                          const currentValue = valores[groupName] || 0
                          
                          // Valor por unidade com taxa aplicada (valor base + taxa)
                          const valorPorUnidade = currentValue * (1 + taxa / 100)
                          // Valor total do grupo (com taxa)
                          const valorTotalGrupo = valorPorUnidade * accountCount
                          // Valor que ele ganha (sem taxa) - valor base total
                          const valorQueGanha = currentValue * accountCount
                          
                          return (
                            <div
                              key={groupName}
                              className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <div className="font-bold text-gray-800 mb-1">
                                    {groupName === 'inicio' ? '< 1k' : groupName.toUpperCase()}
                                  </div>
                                  <div className="text-sm text-gray-600">
                                    {accountCount} conta(s)
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm text-gray-700 font-medium">R$</span>
                                  <input
                                    type="number"
                                    min="0"
                                    step="0.01"
                                    value={currentValue}
                                    onChange={(e) => {
                                      const newValue = parseFloat(e.target.value) || 0
                                      setValores({
                                        ...valores,
                                        [groupName]: newValue
                                      })
                                    }}
                                    className="w-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    placeholder="0.00"
                                  />
                                </div>
                              </div>
                              {currentValue > 0 && (
                                <div className="pt-3 border-t border-gray-300 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">Valor por unidade (com {taxa.toFixed(2).replace('.', ',')}%):</span>
                                    <span className="text-base font-bold text-green-600">
                                      R$ {valorPorUnidade.toFixed(2).replace('.', ',')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600">💰 Valor que você ganha (sem taxa):</span>
                                    <span className="text-base font-bold text-blue-600">
                                      R$ {valorQueGanha.toFixed(2).replace('.', ',')}
                                    </span>
                                  </div>
                                  <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                                    <span className="text-sm font-semibold text-gray-800">Valor total do grupo (com taxa):</span>
                                    <span className="text-lg font-bold text-purple-600">
                                      R$ {valorTotalGrupo.toFixed(2).replace('.', ',')}
                                    </span>
                                  </div>
                                </div>
                              )}
                            </div>
                          )
                        })}
                      </div>
                    )
                  })()}
                </div>

                <button
                  onClick={async () => {
                    try {
                      const response = await fetch('/api/valores', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ valores, taxa }),
                      })
                      
                      if (response.ok) {
                        alert('Valores e taxa salvos com sucesso!')
                      } else {
                        const errorData = await response.json()
                        alert(errorData.error || 'Erro ao salvar valores')
                      }
                    } catch (e) {
                      console.error('Erro ao salvar valores:', e)
                      alert('Erro ao conectar com o servidor')
                    }
                  }}
                  className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-all"
                >
                  💾 Salvar Valores e Taxa
                </button>
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