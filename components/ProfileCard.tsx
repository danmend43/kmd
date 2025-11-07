interface ProfileData {
  username: string
  displayName: string
  avatar: string
  followers: string
  likes: string
  bio: string
  verified: boolean
  url?: string
  email?: string
  password?: string
  name?: string
  sequence?: number
}

interface ProfileCardProps {
  profileData: ProfileData
  onCheckSequence?: () => void
}

// Função para limpar o nome, removendo " (@username) on Kwai"
const cleanDisplayName = (name: string): string => {
  if (!name) return ''
  // Remove padrões como " (@username) on Kwai"
  return name.replace(/\s*\(@[^)]+\)\s*on\s+Kwai\s*$/i, '').trim()
}

export default function ProfileCard({ profileData, onCheckSequence }: ProfileCardProps) {
  const today = typeof window !== 'undefined' ? new Date().toISOString().split('T')[0] : ''
  const lastCheck = typeof window !== 'undefined' ? localStorage.getItem(`check_${profileData.url}`) : null
  const isCheckedToday = lastCheck === today

  const displayName = cleanDisplayName(profileData.displayName || profileData.name || profileData.username || 'N/A')

  return (
    <div className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-lg transition-all overflow-hidden">
      <div className="p-5 space-y-4">
        {/* Avatar e Nome */}
        <div className="flex items-center gap-4">
          {profileData.avatar ? (
            <img
              src={profileData.avatar}
              alt={displayName}
              className="w-16 h-16 rounded-xl border-2 border-purple-400 object-cover flex-shrink-0 shadow-sm"
              onError={(e) => {
                e.currentTarget.style.display = 'none'
              }}
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-purple-400 flex items-center justify-center flex-shrink-0 shadow-sm">
              <span className="text-2xl text-white font-bold">
                {displayName[0]?.toUpperCase() || '?'}
              </span>
            </div>
          )}
          <div className="flex-1 min-w-0">
            <div className="font-bold text-gray-800 truncate text-base mb-1">
              {displayName}
            </div>
            {profileData.username && (
              <div className="text-xs text-gray-500 truncate">
                @{profileData.username}
              </div>
            )}
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
            <div className="text-xs text-blue-600 font-medium mb-1">Seguidores</div>
            <div className="text-base font-bold text-gray-800">{profileData.followers || 'N/A'}</div>
          </div>
          <div className="bg-pink-50 rounded-lg p-3 border border-pink-100">
            <div className="text-xs text-pink-600 font-medium mb-1">Curtidas</div>
            <div className="text-base font-bold text-gray-800">{profileData.likes || 'N/A'}</div>
          </div>
        </div>

        {/* Ações */}
        {profileData.url && (
          <div className="pt-2 border-t border-gray-100">
            <a
              href={profileData.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full px-4 py-2 bg-gray-100 text-gray-700 text-sm font-semibold rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              Ver Perfil
            </a>
          </div>
        )}
      </div>
    </div>
  )
}