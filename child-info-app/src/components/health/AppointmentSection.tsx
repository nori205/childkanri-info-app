// ===========================
// 通院・予約管理セクション（ステップ⑦）
// ===========================

import { useState } from 'react'
import { CalendarDays, ChevronDown, ChevronUp, Trash2, Plus, Pencil, CheckCircle2, Circle } from 'lucide-react'
import type { Appointment, Task } from '../../types'

interface AppointmentSectionProps {
  appointments: Appointment[]
  onAdd: (values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => void
  locationSuggestions?: string[]
  tasks?: Task[]
  onToggleTask?: (id: string) => void
}

// YYYY-MM-DD を M/D 形式に変換（例：2026-04-10 → 4/10）
const formatDate = (dateStr: string): string => {
  const [, m, d] = dateStr.split('-')
  return `${parseInt(m)}/${parseInt(d)}`
}

// YYYY-MM を "YYYY年M月" に変換（例：2026-04 → 2026年4月）
const formatMonthLabel = (yearMonth: string): string => {
  const [y, m] = yearMonth.split('-')
  return `${y}年${parseInt(m)}月`
}

// 予約リストを月ごとにグループ化する
const groupByMonth = (appts: Appointment[]): { label: string; items: Appointment[] }[] => {
  const map = new Map<string, Appointment[]>()
  appts.forEach((a) => {
    const key = a.date.slice(0, 7) // YYYY-MM
    if (!map.has(key)) map.set(key, [])
    map.get(key)!.push(a)
  })
  return Array.from(map.entries()).map(([key, items]) => ({
    label: formatMonthLabel(key),
    items,
  }))
}

// ── 予定の1行コンポーネント ───────────

const AppointmentItem = ({
  appointment,
  onDelete,
  onEdit,
  linkedTasks = [],
  onToggleTask,
}: {
  appointment: Appointment
  onDelete: (id: string) => void
  onEdit: (appointment: Appointment) => void
  linkedTasks?: Task[]
  onToggleTask?: (id: string) => void
}) => (
  <li className="bg-cream rounded-lg px-3 py-2">
    <div className="flex items-start justify-between gap-2">
      <div className="flex-1 min-w-0">
        {/* 日付・時間・内容 */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-rose-brown whitespace-nowrap">
            {formatDate(appointment.date)}
            {appointment.time && (
              <span className="ml-1 font-normal">{appointment.time}</span>
            )}
          </span>
          <span className="text-sm text-dark-brown truncate">{appointment.content}</span>
        </div>
        {/* 病院名・場所（任意） */}
        {appointment.location && (
          <p className="text-xs text-dark-brown/70 mt-0.5 truncate">{appointment.location}</p>
        )}
        {/* メモ（任意） */}
        {appointment.memo && (
          <p className="text-xs text-dark-brown/60 mt-0.5 truncate">{appointment.memo}</p>
        )}
      </div>
      {/* 編集ボタン */}
      <button
        onClick={() => onEdit(appointment)}
        className="text-rose-brown/40 hover:text-rose-brown transition-colors flex-shrink-0 mt-0.5"
        aria-label="編集"
      >
        <Pencil size={14} />
      </button>
      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(appointment.id)}
        className="text-rose-brown/50 hover:text-rose-brown transition-colors shrink-0 mt-0.5"
        aria-label="削除"
      >
        <Trash2 size={14} />
      </button>
    </div>

    {/* この日のタスク */}
    {linkedTasks.length > 0 && (
      <ul className="mt-2 space-y-1 border-t border-rose-brown/10 pt-2">
        {linkedTasks.map((task) => (
          <li key={task.id} className="flex items-center gap-1.5">
            <button
              onClick={() => onToggleTask?.(task.id)}
              className="flex-shrink-0 text-rose-brown/60 hover:text-rose-brown transition-colors"
              aria-label={task.completed ? '未完了に戻す' : '完了にする'}
            >
              {task.completed
                ? <CheckCircle2 size={15} className="text-rose-brown" />
                : <Circle size={15} />}
            </button>
            <span className={`text-xs ${task.completed ? 'line-through text-dark-brown/40' : 'text-dark-brown'}`}>
              {task.title}
            </span>
          </li>
        ))}
      </ul>
    )}
  </li>
)

// ── メインコンポーネント ──────────────

const AppointmentSection = ({ appointments, onAdd, onDelete, onUpdate, locationSuggestions = [], tasks = [], onToggleTask }: AppointmentSectionProps) => {
  // アコーディオンの開閉
  const [isOpen, setIsOpen] = useState(true)
  // 全期間表示モード
  const [showAll, setShowAll] = useState(false)
  // 追加フォームの表示
  const [isFormOpen, setIsFormOpen] = useState(false)
  // 編集中のID（nullなら新規追加）
  const [editingId, setEditingId] = useState<string | null>(null)

  // フォームの入力値
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [content, setContent] = useState('')
  const [location, setLocation] = useState('')
  const [memo, setMemo] = useState('')

  // ── 表示対象の絞り込み ────────────────

  // 今日の日付（YYYY-MM-DD）
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const todayStr = today.toISOString().slice(0, 10)

  // 今月・来月の年月（0-indexed）
  const thisYear = today.getFullYear()
  const thisMonth = today.getMonth()
  const nextMonthDate = new Date(thisYear, thisMonth + 1, 1)
  const nextYear = nextMonthDate.getFullYear()
  const nextMonth = nextMonthDate.getMonth()

  // デフォルト表示：今日以降 かつ 今月または来月
  const defaultAppointments = appointments.filter((a) => {
    if (a.date < todayStr) return false
    const [y, m] = a.date.split('-').map(Number)
    const aMonth = m - 1 // 0-indexed に変換
    return (
      (y === thisYear && aMonth === thisMonth) ||
      (y === nextYear && aMonth === nextMonth)
    )
  })

  // バッジ用：全件数
  const totalCount = appointments.length

  // ── フォーム操作 ──────────────────────

  const openNewForm = () => {
    setEditingId(null)
    setDate('')
    setTime('')
    setContent('')
    setLocation('')
    setMemo('')
    setIsFormOpen(true)
  }

  const openEditForm = (appointment: Appointment) => {
    setEditingId(appointment.id)
    setDate(appointment.date)
    setTime(appointment.time ?? '')
    setContent(appointment.content)
    setLocation(appointment.location)
    setMemo(appointment.memo)
    setIsFormOpen(true)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!date || !content.trim()) return
    const values = {
      date,
      time,
      content: content.trim(),
      location: location.trim(),
      memo: memo.trim(),
    }
    if (editingId) {
      onUpdate(editingId, values)
    } else {
      onAdd(values)
    }
    // フォームをリセットして閉じる
    setDate('')
    setTime('')
    setContent('')
    setLocation('')
    setMemo('')
    setIsFormOpen(false)
    setEditingId(null)
  }

  const handleCancel = () => {
    setDate('')
    setTime('')
    setContent('')
    setLocation('')
    setMemo('')
    setIsFormOpen(false)
    setEditingId(null)
  }

  return (
    <div className="bg-pink-soft rounded-xl overflow-hidden">
      {/* アコーディオンヘッダー */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={15} className="text-rose-brown" />
          <span className="text-sm font-semibold text-rose-brown">通院・予約管理</span>
          {/* 件数バッジ */}
          {totalCount > 0 && (
            <span className="text-xs bg-pink-muted text-cream px-2 py-0.5 rounded-full">
              {totalCount}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={16} className="text-rose-brown" />
        ) : (
          <ChevronDown size={16} className="text-rose-brown" />
        )}
      </button>

      {/* アコーディオン本体 */}
      {isOpen && (
        <div className="px-4 pb-4 space-y-3">
          {/* 予定一覧 */}
          {!showAll ? (
            // デフォルト表示：今月・来月のみ
            defaultAppointments.length === 0 ? (
              <p className="text-sm text-dark-brown/60 text-center py-2">
                今月の予定はありません
              </p>
            ) : (
              <ul className="space-y-2">
                {defaultAppointments.map((a) => (
                  <AppointmentItem key={a.id} appointment={a} onDelete={onDelete} onEdit={openEditForm} linkedTasks={tasks.filter((t) => t.dueDate === a.date)} onToggleTask={onToggleTask} />
                ))}
              </ul>
            )
          ) : (
            // 全期間表示：月ごとにグループ
            appointments.length === 0 ? (
              <p className="text-sm text-dark-brown/60 text-center py-2">
                予定はありません
              </p>
            ) : (
              <div className="space-y-3">
                {groupByMonth(appointments).map((group) => (
                  <div key={group.label}>
                    {/* 月ヘッダー（── 4月 ── 形式） */}
                    <div className="flex items-center gap-2 mb-1.5">
                      <div className="flex-1 h-px bg-rose-brown/30" />
                      <span className="text-xs text-rose-brown font-medium px-1">
                        {group.label}
                      </span>
                      <div className="flex-1 h-px bg-rose-brown/30" />
                    </div>
                    <ul className="space-y-2">
                      {group.items.map((a) => (
                        <AppointmentItem key={a.id} appointment={a} onDelete={onDelete} onEdit={openEditForm} linkedTasks={tasks.filter((t) => t.dueDate === a.date)} onToggleTask={onToggleTask} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )
          )}

          {/* 全件表示 / 今月来月表示 切り替えボタン */}
          <div className="flex justify-center">
            {!showAll ? (
              <button
                onClick={() => setShowAll(true)}
                className="text-xs text-rose-brown underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                全ての予定を見る
              </button>
            ) : (
              <button
                onClick={() => setShowAll(false)}
                className="text-xs text-rose-brown underline underline-offset-2 hover:opacity-70 transition-opacity"
              >
                閉じる
              </button>
            )}
          </div>

          {/* 追加・編集フォーム */}
          {isFormOpen ? (
            <form onSubmit={handleSubmit} className="bg-cream rounded-lg p-3 space-y-2">
              {/* フォームヘッダー */}
              <p className="text-xs font-medium text-dark-brown">
                {editingId ? '編集' : '新規追加'}
              </p>

              {/* 日付（必須） */}
              <div>
                <label className="text-xs text-dark-brown font-medium">
                  日付 <span className="text-rose-brown">*</span>
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="mt-0.5 w-full text-sm px-2.5 py-1.5 rounded-lg border border-pink-muted/40 bg-white focus:outline-none focus:ring-1 focus:ring-pink-muted text-dark-brown"
                />
              </div>

              {/* 時間（任意） */}
              <div>
                <label className="text-xs text-dark-brown font-medium">時間（任意）</label>
                <input
                  type="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="mt-0.5 w-full text-sm px-2.5 py-1.5 rounded-lg border border-pink-muted/40 bg-white focus:outline-none focus:ring-1 focus:ring-pink-muted text-dark-brown"
                />
              </div>

              {/* 内容（必須） */}
              <div>
                <label className="text-xs text-dark-brown font-medium">
                  内容 <span className="text-rose-brown">*</span>
                </label>
                <input
                  type="text"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="例：小児科、療育、皮膚科、歯科検診"
                  required
                  list="appt-content-suggestions"
                  className="mt-0.5 w-full text-sm px-2.5 py-1.5 rounded-lg border border-pink-muted/40 bg-white focus:outline-none focus:ring-1 focus:ring-pink-muted text-dark-brown placeholder:text-dark-brown/40"
                />
                <datalist id="appt-content-suggestions">
                  {appointments.map((a) => a.content).filter(Boolean).filter((v, i, arr) => arr.indexOf(v) === i).map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              {/* 病院名・場所（任意） */}
              <div>
                <label className="text-xs text-dark-brown font-medium">病院名・場所</label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="例：〇〇クリニック、△△センター"
                  list="appt-location-suggestions"
                  className="mt-0.5 w-full text-sm px-2.5 py-1.5 rounded-lg border border-pink-muted/40 bg-white focus:outline-none focus:ring-1 focus:ring-pink-muted text-dark-brown placeholder:text-dark-brown/40"
                />
                <datalist id="appt-location-suggestions">
                  {[
                    ...locationSuggestions,
                    ...appointments.map((a) => a.location).filter(Boolean),
                  ].filter((v, i, arr) => arr.indexOf(v) === i).map((v) => (
                    <option key={v} value={v} />
                  ))}
                </datalist>
              </div>

              {/* メモ（任意） */}
              <div>
                <label className="text-xs text-dark-brown font-medium">メモ</label>
                <input
                  type="text"
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="例：持ち物、注意事項など"
                  className="mt-0.5 w-full text-sm px-2.5 py-1.5 rounded-lg border border-pink-muted/40 bg-white focus:outline-none focus:ring-1 focus:ring-pink-muted text-dark-brown placeholder:text-dark-brown/40"
                />
              </div>

              {/* 操作ボタン */}
              <div className="flex gap-2 pt-1">
                <button
                  type="submit"
                  className="flex-1 text-sm bg-pink-muted text-cream py-1.5 rounded-lg font-medium hover:opacity-90 transition-opacity"
                >
                  {editingId ? '保存する' : '追加する'}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-3 text-sm text-rose-brown border border-rose-brown/30 rounded-lg hover:bg-pink-soft transition-colors"
                >
                  キャンセル
                </button>
              </div>
            </form>
          ) : (
            <button
              onClick={openNewForm}
              className="w-full flex items-center justify-center gap-1 text-sm text-rose-brown border border-rose-brown/30 rounded-lg py-2 hover:bg-cream transition-colors"
            >
              <Plus size={14} />
              予定を追加
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default AppointmentSection
