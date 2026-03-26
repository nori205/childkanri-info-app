// ===========================
// 全子供の予定まとめビュー
// ===========================

import { CalendarDays, Stethoscope, FileText, ShoppingBag, PenLine, Banknote, Circle } from 'lucide-react'
import type { Child, Task, Appointment } from '../types'

interface ScheduleViewProps {
  children: Child[]
  tasks: Task[]
  appointments: Appointment[]
}

// 子供ごとの色（インデックス順）
const CHILD_COLORS = [
  { bg: 'bg-rose-100', text: 'text-rose-700', dot: 'bg-rose-400' },
  { bg: 'bg-blue-100', text: 'text-blue-700', dot: 'bg-blue-400' },
  { bg: 'bg-emerald-100', text: 'text-emerald-700', dot: 'bg-emerald-400' },
  { bg: 'bg-purple-100', text: 'text-purple-700', dot: 'bg-purple-400' },
]

// 日付を「3月27日（木）今日」形式に変換
const formatDateLabel = (dateStr: string, todayStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00')
  const weekdays = ['日', '月', '火', '水', '木', '金', '土']
  const label = `${d.getMonth() + 1}月${d.getDate()}日（${weekdays[d.getDay()]}）`
  return dateStr === todayStr ? `${label} 今日` : label
}

// タスクカテゴリのアイコン
const TaskIcon = ({ category }: { category: string }) => {
  const cls = 'flex-shrink-0'
  switch (category) {
    case '書類提出': return <FileText size={13} className={cls} />
    case '持ち物チェック': return <ShoppingBag size={13} className={cls} />
    case '記入・署名': return <PenLine size={13} className={cls} />
    case '支払い・入金': return <Banknote size={13} className={cls} />
    default: return <Circle size={13} className={cls} />
  }
}

// 統合イベント型
type ScheduleEvent =
  | { type: 'appointment'; date: string; childId: string; label: string }
  | { type: 'task'; date: string; childId: string; label: string; category: string }

const ScheduleView = ({ children, tasks, appointments }: ScheduleViewProps) => {
  const todayStr = new Date().toISOString().slice(0, 10)

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

  // 日付ごとにグループ化
  const grouped: Map<string, ScheduleEvent[]> = new Map()
  for (const ev of allEvents) {
    const list = grouped.get(ev.date) ?? []
    list.push(ev)
    grouped.set(ev.date, list)
  }

  // 子供IDからインデックスを取得
  const childIndexMap = new Map(children.map((c, i) => [c.id, i]))
  const childNameMap = new Map(children.map((c) => [c.id, c.name]))

  return (
    <section className="mb-2">
      <div className="flex items-center gap-2 mb-3">
        <CalendarDays size={17} className="text-rose-brown" />
        <h2 className="text-base font-semibold text-rose-brown">今後の予定</h2>
      </div>

      <div className="space-y-3">
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
                    {/* 子供名バッジ */}
                    <span className={`flex-shrink-0 text-xs font-medium px-2 py-0.5 rounded-full ${color.bg} ${color.text}`}>
                      {childName}
                    </span>

                    {/* アイコン＋内容 */}
                    <span className="text-rose-brown/50">
                      {ev.type === 'appointment'
                        ? <Stethoscope size={13} className="flex-shrink-0" />
                        : <TaskIcon category={ev.category} />}
                    </span>
                    <span className="text-sm text-dark-brown leading-tight">{ev.label}</span>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default ScheduleView
