'use client'

import { useState } from 'react'

interface CalendarComponentProps {
  markedDays: { [key: string]: boolean }
  setMarkedDays: (days: { [key: string]: boolean }) => void
  sequences: { [key: string]: number }
  setSequences: (seq: { [key: string]: number }) => void
  selectedDate: Date | null
  setSelectedDate: (date: Date | null) => void
}

export default function CalendarComponent({
  markedDays,
  setMarkedDays,
  sequences,
  setSequences,
  selectedDate,
  setSelectedDate
}: CalendarComponentProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [isSaving, setIsSaving] = useState(false)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  // Formato de data para chave (YYYY-MM-DD)
  const formatDateKey = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
  }

  // Verificar se é hoje
  const isToday = (date: Date): boolean => {
    const d = new Date(date)
    d.setHours(0, 0, 0, 0)
    return d.getTime() === today.getTime()
  }

  // Obter primeiro dia do mês
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
  const lastDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)
  const firstDayWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  // Nomes dos dias da semana
  const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
  const monthNames = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ]

  // Criar array de dias do calendário
  const calendarDays: (Date | null)[] = []
  
  // Adicionar dias vazios no início
  for (let i = 0; i < firstDayWeek; i++) {
    calendarDays.push(null)
  }
  
  // Adicionar dias do mês
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day))
  }

  // Contar sequência de dias marcados consecutivos (da data mais recente para trás)
  const calculateSequence = (): number => {
    const sortedDates = Object.keys(markedDays)
      .filter(key => markedDays[key])
      .map(key => new Date(key + 'T00:00:00'))
      .sort((a, b) => b.getTime() - a.getTime()) // Mais recente primeiro
    
    if (sortedDates.length === 0) return 0

    let sequence = 1
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    // Começar da data mais recente e ir para trás
    for (let i = 0; i < sortedDates.length - 1; i++) {
      const currentDate = sortedDates[i]
      const nextDate = sortedDates[i + 1]
      
      // Verificar se é consecutivo (diferença de 1 dia)
      const diffTime = currentDate.getTime() - nextDate.getTime()
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
      
      if (diffDays === 1) {
        sequence++
      } else {
        // Se encontrar uma quebra, verificar se há sequência mais recente
        break
      }
    }
    
    return sequence
  }

  const totalSequence = calculateSequence()

  // Selecionar dia
  const handleDayClick = (date: Date | null) => {
    if (!date) return
    setSelectedDate(new Date(date))
  }

  // Confirmar/Atualizar dia
  const handleConfirmDay = async () => {
    if (!selectedDate) return

    const dateKey = formatDateKey(selectedDate)
    const isCurrentlyMarked = markedDays[dateKey] || false

    // Toggle: se já está marcado, desmarca; se não está, marca
    const newMarkedDays = { ...markedDays }
    
    if (isCurrentlyMarked) {
      delete newMarkedDays[dateKey]
    } else {
      newMarkedDays[dateKey] = true
    }

    setMarkedDays(newMarkedDays)
 
    const tempMarkedDays = isCurrentlyMarked 
      ? { ...markedDays, [dateKey]: false }
      : { ...markedDays, [dateKey]: true }
     
    const sortedDates = Object.keys(tempMarkedDays)
      .filter(key => tempMarkedDays[key])
      .map(key => new Date(key + 'T00:00:00'))
      .sort((a, b) => b.getTime() - a.getTime())
    
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
    
    const newSequences = { ...sequences }
    newSequences['global'] = newSequence
    setSequences(newSequences)
 
    setIsSaving(true)
    try {
      const response = await fetch('/api/calendar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          markedDays: newMarkedDays,
          sequences: newSequences
        }),
      })

      if (response.ok) {
        console.log('Calendário salvo com sucesso')
      }
    } catch (error) {
      console.error('Erro ao salvar calendário:', error)
    } finally {
      setIsSaving(false)
    }
  }

  // Navegar meses
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  }

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
    setSelectedDate(new Date())
  }

  const selectedDateKey = selectedDate ? formatDateKey(selectedDate) : ''
  const isSelectedToday = selectedDate ? isToday(selectedDate) : false
  const isSelectedMarked = selectedDateKey ? markedDays[selectedDateKey] : false

  return (
    <div className="space-y-6">
      {/* Info da Sequência */}
      <div className="bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg p-4 border border-purple-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Sequência Atual</p>
            <p className="text-3xl font-bold text-purple-600">{totalSequence} dias</p>
          </div>
          <button
            onClick={goToToday}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            Hoje
          </button>
        </div>
      </div>

      {/* Controles do Calendário */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          ←
        </button>
        <h3 className="text-xl font-bold text-gray-800">
          {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
        </h3>
        <button
          onClick={goToNextMonth}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          →
        </button>
      </div>

      {/* Calendário */}
      <div className="grid grid-cols-7 gap-2">
        {/* Cabeçalho dos dias da semana */}
        {weekDays.map(day => (
          <div key={day} className="text-center font-semibold text-gray-600 py-2">
            {day}
          </div>
        ))}

        {/* Dias do calendário */}
        {calendarDays.map((date, index) => {
          if (!date) {
            return <div key={`empty-${index}`} className="aspect-square" />
          }

          const dateKey = formatDateKey(date)
          const isMarked = markedDays[dateKey] || false
          const isDateToday = isToday(date)
          const isSelected = selectedDateKey === dateKey

          return (
            <button
              key={dateKey}
              onClick={() => handleDayClick(date)}
              className={`
                aspect-square rounded-lg border-2 transition-all
                ${isSelected 
                  ? 'border-purple-600 bg-purple-50' 
                  : 'border-gray-200 hover:border-purple-300'
                }
                ${isDateToday ? 'bg-blue-50 border-blue-400' : ''}
                ${isMarked ? 'bg-green-100 border-green-400' : 'bg-white'}
                flex flex-col items-center justify-center relative
              `}
            >
              <span className={`text-sm font-semibold ${isDateToday ? 'text-blue-600' : 'text-gray-700'}`}>
                {date.getDate()}
              </span>
              {isMarked && (
                <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full"></div>
              )}
            </button>
          )
        })}
      </div>

      {/* Painel de Ações */}
      {selectedDate && (
        <div className="mt-6 bg-gray-50 rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-gray-600">Data Selecionada</p>
              <p className="text-lg font-bold text-gray-800">
                {selectedDate.toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </p>
            </div>
            <div className={`w-4 h-4 rounded-full ${isSelectedMarked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
          </div>

          <div className="flex gap-3">
            {isSelectedToday ? (
              <button
                onClick={handleConfirmDay}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Salvando...' : isSelectedMarked ? 'Desmarcar Dia' : '✓ Confirmar Dia'}
              </button>
            ) : (
              <button
                onClick={handleConfirmDay}
                disabled={isSaving}
                className="flex-1 px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? 'Atualizando...' : isSelectedMarked ? 'Desmarcar Dia' : '🔄 Atualizar Dia'}
              </button>
            )}
          </div>

          {isSelectedMarked && (
            <p className="mt-3 text-sm text-green-600 font-semibold">
              ✓ Este dia está marcado na sua sequência
            </p>
          )}
        </div>
      )}
    </div>
  )
}

