// ===========================
// 起動時予約リマインダーバナー
// ===========================

import { useState } from 'react'
import { Bell, X } from 'lucide-react'
import type { Appointment, Child } from '../types'

interface AppointmentReminderProps {
  appointments: Appointment[]
  children: Child[]
}

// 今日・明日の日付文字列（YYYY-MM-DD、ローカル時刻）
const getLocalDateStr = (offsetDays: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + offsetDays)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const formatDate = (dateStr: string, todayStr: string): string => {
  if (dateStr === todayStr) return '今日'
  return '明日'
}

const AppointmentReminder = ({ appointments, children }: AppointmentReminderProps) => {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const todayStr = getLocalDateStr(0)
  const tomorrowStr = getLocalDateStr(1)

  const upcoming = appointments
    .filter((ap) => ap.date === todayStr || ap.date === tomorrowStr)
    .sort((a, b) => {
      if (a.date !== b.date) return a.date.localeCompare(b.date)
      return (a.time ?? '').localeCompare(b.time ?? '')
    })

  if (upcoming.length === 0) return null

  const childNameMap = new Map(children.map((c) => [c.id, c.name]))

  return (
    <div className="bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 flex items-start gap-3">
      <Bell size={16} className="text-amber-500 flex-shrink-0 mt-0.5" />
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold text-amber-700 mb-1.5">予約のお知らせ</p>
        <ul className="space-y-1">
          {upcoming.map((ap) => (
            <li key={ap.id} className="text-xs text-amber-800 leading-snug">
              <span className="font-medium">{formatDate(ap.date, todayStr)}</span>
              {ap.time && <span>　{ap.time}</span>}
              　{childNameMap.get(ap.childId) ?? ''}　{ap.content}
              {ap.location && <span className="text-amber-700/70">（{ap.location}）</span>}
            </li>
          ))}
        </ul>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-amber-400 hover:text-amber-600 transition-colors flex-shrink-0"
        aria-label="閉じる"
      >
        <X size={15} />
      </button>
    </div>
  )
}

export default AppointmentReminder
