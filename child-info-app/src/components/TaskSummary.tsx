// ===========================
// タスクのダッシュボードサマリー（ボタン小さく・タップで展開）
// ===========================

import { useState } from 'react'
import { AlertCircle, Clock, ListTodo, ChevronDown, ChevronUp } from 'lucide-react'
import type { Task, Appointment } from '../types'

interface TaskSummaryProps {
  tasks: Task[]
  appointments: Appointment[]
  onActiveFilterChange?: (active: boolean) => void
}

// 今日の日付文字列を返す（YYYY-MM-DD、ローカル時刻）
const today = (): string => {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// N日後の日付文字列を返す（ローカル時刻）
const daysLater = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 日付を「M月D日」形式に変換
const fmtDate = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

type FilterKey = 'today' | 'soon' | 'all'

const TaskSummary = ({ tasks, appointments, onActiveFilterChange }: TaskSummaryProps) => {
  const [activeFilter, setActiveFilter] = useState<FilterKey | null>(null)

  const incompleteTasks = tasks.filter((t) => !t.completed)
  const todayStr = today()
  const soonStr = daysLater(3)

  // 今日期限
  const todayTasks = incompleteTasks.filter((t) => t.dueDate === todayStr)
  const todayAps = appointments.filter((ap) => ap.date === todayStr)
  const todayCount = todayTasks.length + todayAps.length

  // 3日以内
  const soonTasks = incompleteTasks.filter((t) => t.dueDate && t.dueDate > todayStr && t.dueDate <= soonStr)
  const soonAps = appointments.filter((ap) => ap.date > todayStr && ap.date <= soonStr)
  const soonCount = soonTasks.length + soonAps.length

  // 未完了合計
  const totalCount = incompleteTasks.length

  if (todayCount === 0 && soonCount === 0 && totalCount === 0) return null

  const toggle = (key: FilterKey) => {
    const next = activeFilter === key ? null : key
    setActiveFilter(next)
    onActiveFilterChange?.(next !== null)
  }

  // 展開リストの内容
  const renderItems = () => {
    let taskItems: Task[] = []
    let apItems: Appointment[] = []

    if (activeFilter === 'today') {
      taskItems = todayTasks
      apItems = todayAps
    } else if (activeFilter === 'soon') {
      taskItems = soonTasks
      apItems = soonAps
    } else if (activeFilter === 'all') {
      taskItems = incompleteTasks
      apItems = []
    }

    if (taskItems.length === 0 && apItems.length === 0) {
      return <p className="text-xs text-rose-brown/60 text-center py-2">該当する項目はありません</p>
    }

    return (
      <div className="space-y-1.5">
        {apItems.map((ap) => (
          <div key={ap.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-pink-soft/60">
            <span className="text-xs bg-rose-brown/10 text-rose-brown px-1.5 py-0.5 rounded flex-shrink-0">通院</span>
            <span className="text-sm text-dark-brown flex-1 truncate">{ap.content}</span>
            <span className="text-xs text-rose-brown/60 flex-shrink-0">{fmtDate(ap.date)}</span>
          </div>
        ))}
        {taskItems.map((t) => (
          <div key={t.id} className="flex items-center gap-2 bg-white rounded-lg px-3 py-2 border border-pink-soft/60">
            <span className="text-xs bg-pink-soft text-rose-brown px-1.5 py-0.5 rounded flex-shrink-0">{t.category[0]}</span>
            <span className="text-sm text-dark-brown flex-1 truncate">{t.title}</span>
            {t.dueDate && (
              <span className="text-xs text-rose-brown/60 flex-shrink-0">{fmtDate(t.dueDate)}</span>
            )}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="mb-3">
      {/* 3つのコンパクトボタン */}
      <div className="grid grid-cols-3 gap-2">
        {/* 今日期限 */}
        <button
          onClick={() => toggle('today')}
          className={`rounded-xl px-2 py-2 flex items-center justify-between gap-1 transition-opacity ${
            activeFilter === 'today' ? 'opacity-100' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ backgroundColor: '#D53E0F' }}
        >
          <div className="flex items-center gap-1.5">
            <AlertCircle size={13} className="text-white flex-shrink-0" />
            <span className="text-xs text-white font-semibold">{todayCount}</span>
            <span className="text-xs text-white/90">今日期限</span>
          </div>
          {activeFilter === 'today'
            ? <ChevronUp size={12} className="text-white/70 flex-shrink-0" />
            : <ChevronDown size={12} className="text-white/70 flex-shrink-0" />
          }
        </button>

        {/* 3日以内 */}
        <button
          onClick={() => toggle('soon')}
          className={`rounded-xl px-2 py-2 flex items-center justify-between gap-1 transition-opacity ${
            activeFilter === 'soon' ? 'opacity-100' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ backgroundColor: '#FFD400' }}
        >
          <div className="flex items-center gap-1.5">
            <Clock size={13} className="text-gray-700 flex-shrink-0" />
            <span className="text-xs text-gray-800 font-semibold">{soonCount}</span>
            <span className="text-xs text-gray-700">3日以内</span>
          </div>
          {activeFilter === 'soon'
            ? <ChevronUp size={12} className="text-gray-600 flex-shrink-0" />
            : <ChevronDown size={12} className="text-gray-600 flex-shrink-0" />
          }
        </button>

        {/* 未完了合計 */}
        <button
          onClick={() => toggle('all')}
          className={`rounded-xl px-2 py-2 flex items-center justify-between gap-1 transition-opacity ${
            activeFilter === 'all' ? 'opacity-100' : 'opacity-90 hover:opacity-100'
          }`}
          style={{ backgroundColor: '#3291B6' }}
        >
          <div className="flex items-center gap-1.5">
            <ListTodo size={13} className="text-white flex-shrink-0" />
            <span className="text-xs text-white font-semibold">{totalCount}</span>
            <span className="text-xs text-white/90">未完了</span>
          </div>
          {activeFilter === 'all'
            ? <ChevronUp size={12} className="text-white/70 flex-shrink-0" />
            : <ChevronDown size={12} className="text-white/70 flex-shrink-0" />
          }
        </button>
      </div>

      {/* 展開リスト */}
      {activeFilter && (
        <div className="mt-2 bg-cream/60 rounded-xl p-3">
          {renderItems()}
        </div>
      )}
    </div>
  )
}

export default TaskSummary
