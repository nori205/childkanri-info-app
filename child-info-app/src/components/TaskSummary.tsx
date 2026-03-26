// ===========================
// タスクのダッシュボードサマリー
// ===========================

import { AlertCircle, Clock, ListTodo } from 'lucide-react'
import type { Task } from '../types'

interface TaskSummaryProps {
  tasks: Task[]
}

// 今日の日付文字列を返す（YYYY-MM-DD）
const today = (): string => new Date().toISOString().slice(0, 10)

// N日後の日付文字列を返す
const daysLater = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

const TaskSummary = ({ tasks }: TaskSummaryProps) => {
  const incompleteTasks = tasks.filter((t) => !t.completed)
  const todayStr = today()
  const weekStr = daysLater(7)

  // 今日期限（期限が今日）
  const todayCount = incompleteTasks.filter(
    (t) => t.dueDate === todayStr,
  ).length

  // 今週期限（今日より後、7日以内）
  const weekCount = incompleteTasks.filter(
    (t) => t.dueDate && t.dueDate > todayStr && t.dueDate <= weekStr,
  ).length

  // 未完了合計
  const totalCount = incompleteTasks.length

  if (totalCount === 0) return null

  return (
    <div className="grid grid-cols-3 gap-2 mb-4">
      {/* 今日期限：赤 #D53E0F */}
      <div
        className="rounded-xl p-3 flex flex-col items-center gap-1"
        style={{ backgroundColor: '#D53E0F' }}
      >
        <AlertCircle size={16} className="text-white" />
        <span className="text-2xl font-bold text-white">{todayCount}</span>
        <span className="text-xs text-white/90 text-center leading-tight">今日期限</span>
      </div>

      {/* 今週期限：黄 #FFD400（文字は暗い色） */}
      <div
        className="rounded-xl p-3 flex flex-col items-center gap-1"
        style={{ backgroundColor: '#FFD400' }}
      >
        <Clock size={16} className="text-gray-700" />
        <span className="text-2xl font-bold text-gray-800">{weekCount}</span>
        <span className="text-xs text-gray-700 text-center leading-tight">今週期限</span>
      </div>

      {/* 未完了合計：青 #3291B6 */}
      <div
        className="rounded-xl p-3 flex flex-col items-center gap-1"
        style={{ backgroundColor: '#3291B6' }}
      >
        <ListTodo size={16} className="text-white" />
        <span className="text-2xl font-bold text-white">{totalCount}</span>
        <span className="text-xs text-white/90 text-center leading-tight">未完了合計</span>
      </div>
    </div>
  )
}

export default TaskSummary
