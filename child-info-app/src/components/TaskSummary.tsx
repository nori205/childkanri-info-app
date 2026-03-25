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
      {/* 今日期限 */}
      <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex flex-col items-center gap-1">
        <AlertCircle size={16} className="text-red-400" />
        <span className="text-2xl font-bold text-red-500">{todayCount}</span>
        <span className="text-xs text-red-400 text-center leading-tight">今日期限</span>
      </div>

      {/* 今週期限 */}
      <div className="bg-orange-50 border border-orange-200 rounded-xl p-3 flex flex-col items-center gap-1">
        <Clock size={16} className="text-orange-400" />
        <span className="text-2xl font-bold text-orange-500">{weekCount}</span>
        <span className="text-xs text-orange-400 text-center leading-tight">今週期限</span>
      </div>

      {/* 未完了合計 */}
      <div className="bg-pink-soft/60 border border-pink-soft rounded-xl p-3 flex flex-col items-center gap-1">
        <ListTodo size={16} className="text-rose-brown" />
        <span className="text-2xl font-bold text-dark-brown">{totalCount}</span>
        <span className="text-xs text-rose-brown text-center leading-tight">未完了合計</span>
      </div>
    </div>
  )
}

export default TaskSummary
