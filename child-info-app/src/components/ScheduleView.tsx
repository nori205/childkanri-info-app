// ===========================
// 全子供の予定まとめビュー
// ===========================

import { useState } from 'react'
import { CalendarDays, Stethoscope, FileText, ShoppingBag, PenLine, Banknote, Circle, ChevronDown, ChevronUp } from 'lucide-react'
import type { Child, Task, Appointment } from '../types'

interface ScheduleViewProps {
  children: Child[]
  tasks: Task[]
  appointments: Appointment[]
}

// 子供ごとの色（インデックス順）
const CHILD_COLORS = [
  { bg: 'bg-rose-100', text: 'text-rose-700' },
  { bg: 'bg-blue-100', text: 'text-blue-700' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700' },
  { bg: 'bg-purple-100', text: 'text-purple-700' },
]

// N日後の日付文字列（YYYY-MM-DD、ローカル時刻）
const daysLater = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

// 日付を「3月27日（木）今日」形式に変換
const formatDateLabel = (dateStr: string, todayStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const label = `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`
  return dateStr === todayStr ? `${label} 今日` : label
}

// タスクカテゴリのアイコン
const TaskIcon = ({ category }: { category: string }) => {
  switch (category) {
    case '書類提出': return <FileText size={13} className="flex-shrink-0" />
    case '持ち物チェック': return <ShoppingBag size={13} className="flex-shrink-0" />
    case '記入・署名': return <PenLine size={13} className="flex-shrink-0" />
    case '支払い・入金': return <Banknote size={13} className="flex-shrink-0" />
    default: return <Circle size={13} className="flex-shrink-0" />
  }
}

// 統合イベント型（category は複数カテゴリ対応で配列）
type ScheduleEvent =
  | { type: 'appointment'; date: string; childId: string; label: string }
  | { type: 'task'; date: string; childId: string; label: string; category: string[] }

const ScheduleView = ({ children, tasks, appointments }: ScheduleViewProps) => {
  const [showAll, setShowAll] = useState(false)
  const [isOpen, setIsOpen] = useState(false)

  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
  const twoWeeksStr = daysLater(14)

  // 今日以降の病院予約
  const futureAppointments: ScheduleEvent[] = appointments
    .filter((ap) => ap.date >= todayStr)
    .map((ap) => ({
      type: 'appointment',
      date: ap.date,
      childId: ap.childId,
      label: ap.location ? `${ap.content}（${ap.location}）` : ap.content,
    }))

  // 今日以降の期限付き未完了タスク
  const futureTasks: ScheduleEvent[] = tasks
    .filter((t) => !t.completed && t.dueDate && t.dueDate >= todayStr)
    .map((t) => ({
      type: 'task',
      date: t.dueDate!,
      childId: t.childId,
      label: t.title,
      category: t.category,
    }))

  const allEvents = [...futureAppointments, ...futureTasks].sort((a, b) =>
    a.date.localeCompare(b.date),
  )

  if (allEvents.length === 0) return null

  // 2週間以内と2週間より後に分ける
  const withinTwoWeeks = allEvents.filter((ev) => ev.date <= twoWeeksStr)
  const beyond = allEvents.filter((ev) => ev.date > twoWeeksStr)

  // 表示するイベント（showAll=trueなら全件）
  const visibleEvents = showAll ? allEvents : withinTwoWeeks

  // 日付ごとにグループ化
  const grouped: Map<string, ScheduleEvent[]> = new Map()
  for (const ev of visibleEvents) {
    const list = grouped.get(ev.date) ?? []
    list.push(ev)
    grouped.set(ev.date, list)
  }

  // 子供IDからインデックス・名前を取得
  const childIndexMap = new Map(children.map((c, i) => [c.id, i]))
  const childNameMap = new Map(children.map((c) => [c.id, c.name]))

  return (
    <section className="mb-2">
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="w-full flex items-center justify-between mb-3"
      >
        <div className="flex items-center gap-2">
          <CalendarDays size={17} className="text-rose-brown" />
          <h2 className="text-base font-semibold text-rose-brown">今後の予定</h2>
          <span className="flex items-center gap-1 text-sm font-bold text-rose-brown bg-pink-soft/70 px-2 py-0.5 rounded-full">
            {allEvents.length}件
            {isOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </span>
        </div>
        <span className="text-xs text-rose-brown/60">{formatDateLabel(todayStr, todayStr)}</span>
      </button>

      {isOpen && <div className="space-y-3">
        {Array.from(grouped.entries()).map(([date, events]) => (
          <div key={date} className="bg-white rounded-xl border border-pink-soft/60 overflow-hidden">
            {/* 日付ヘッダー */}
            <div className={`px-3 py-1.5 text-xs font-semibold ${date === todayStr ? 'bg-rose-brown text-cream' : 'bg-pink-soft/40 text-rose-brown'}`}>
              {formatDateLabel(date, todayStr)}
            </div>

            {/* イベント一覧 */}
            <div className="divide-y divide-pink-soft/30">
              {events.map((ev, i) => {
                const idx = childIndexMap.get(ev.childId) ?? 0
                const color = CHILD_COLORS[idx % CHILD_COLORS.length]
                const childName = childNameMap.get(ev.childId) ?? ''

                return (
                  <div key={i} className="flex items-center gap-2.5 px-3 py-2.5">
                    <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                      {childName}
                    </span>
                    <span className="text-rose-brown/50">
                      {ev.type === 'appointment'
                        ? <Stethoscope size={13} className="flex-shrink-0" />
                        : <TaskIcon category={ev.category[0]} />}
                    </span>
                    <span className="text-sm text-dark-brown leading-tight">{ev.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}

        {/* 2週間以降の展開ボタン */}
        {beyond.length > 0 && (
          <button
            onClick={() => setShowAll((prev) => !prev)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-pink-muted/60 text-sm text-rose-brown hover:bg-pink-soft/30 transition-colors"
          >
            {showAll ? (
              <>
                <ChevronUp size={15} />
                2週間以降を閉じる
              </>
            ) : (
              <>
                <ChevronDown size={15} />
                2週間以降の予定を見る（{beyond.length}件）
              </>
            )}
          </button>
        )}
      </div>}
    </section>
  )
}

export default ScheduleView
