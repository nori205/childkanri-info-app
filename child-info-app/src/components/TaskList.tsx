// ===========================
// タスクリストコンポーネント
// ===========================

import {
  FileText,
  ShoppingBag,
  PenLine,
  Banknote,
  Circle,
  Trash2,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react'
import type { Task, TaskCategory } from '../types'
import { DUE_WARN_DAYS } from '../constants'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}

// 種類別アイコンコンポーネントを返す
const CategoryIcon = ({ category }: { category: TaskCategory }) => {
  const cls = 'flex-shrink-0'
  switch (category) {
    case '書類提出':     return <FileText  size={15} className={cls} />
    case '持ち物チェック': return <ShoppingBag size={15} className={cls} />
    case '記入・署名':   return <PenLine   size={15} className={cls} />
    case '支払い・入金': return <Banknote  size={15} className={cls} />
    default:             return <Circle    size={15} className={cls} />
  }
}

// 今日の日付文字列（YYYY-MM-DD）
const todayStr = (): string => new Date().toISOString().slice(0, 10)

// N日後の日付文字列
const daysLaterStr = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

// 期限の状態を返す
type DueStatus = 'overdue' | 'warn' | 'today' | 'normal' | 'none'
const getDueStatus = (dueDate: string | null): DueStatus => {
  if (!dueDate) return 'none'
  const t = todayStr()
  if (dueDate < t) return 'overdue'
  if (dueDate === t) return 'today'
  if (dueDate <= daysLaterStr(DUE_WARN_DAYS)) return 'warn'
  return 'normal'
}

// 日付を日本語形式に変換
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getMonth() + 1}月${d.getDate()}日`
}

// 期限バッジのスタイルと表示テキスト
const dueBadge = (dueDate: string | null, status: DueStatus) => {
  if (!dueDate) return null
  const label = formatDate(dueDate)
  switch (status) {
    case 'overdue':
      return (
        <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium">
          <AlertCircle size={11} />
          {label} 期限切れ
        </span>
      )
    case 'today':
      return (
        <span className="flex items-center gap-0.5 text-xs text-red-500 font-medium">
          <AlertCircle size={11} />
          今日まで
        </span>
      )
    case 'warn':
      return (
        <span className="flex items-center gap-0.5 text-xs text-orange-500 font-medium">
          <Clock size={11} />
          {label} まで
        </span>
      )
    default:
      return (
        <span className="text-xs text-rose-brown/70">{label} まで</span>
      )
  }
}

// 1件のタスク行
const TaskItem = ({
  task,
  onToggle,
  onDelete,
}: {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
}) => {
  const status = getDueStatus(task.dueDate)

  // 期限切れ・今日期限は枠を赤く、3日以内はオレンジに
  const borderClass =
    !task.completed && (status === 'overdue' || status === 'today')
      ? 'border-red-200 bg-red-50/50'
      : !task.completed && status === 'warn'
      ? 'border-orange-200 bg-orange-50/50'
      : task.completed
      ? 'border-pink-soft/40 bg-white/40 opacity-60'
      : 'border-pink-soft bg-white'

  return (
    <div className={`flex items-start gap-3 p-3 rounded-xl border ${borderClass} transition-all`}>
      {/* チェックボタン */}
      <button
        onClick={() => onToggle(task.id)}
        className="mt-0.5 flex-shrink-0 text-pink-muted hover:opacity-70 transition-opacity"
        aria-label={task.completed ? '未完了に戻す' : '完了にする'}
      >
        <CheckCircle2
          size={22}
          className={task.completed ? 'text-pink-muted/50' : 'text-pink-muted'}
          fill={task.completed ? 'currentColor' : 'none'}
        />
      </button>

      {/* タスク情報 */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 mb-0.5">
          <span className={`text-rose-brown/70 ${task.completed ? 'opacity-50' : ''}`}>
            <CategoryIcon category={task.category} />
          </span>
          <span
            className={`text-sm font-medium text-dark-brown ${
              task.completed ? 'line-through text-dark-brown/40' : ''
            }`}
          >
            {task.title}
          </span>
        </div>

        {/* 種類ラベル */}
        <span className="inline-block text-xs text-rose-brown/60 bg-cream px-1.5 py-0.5 rounded-md mb-1">
          {task.category}
        </span>

        {/* 金額 */}
        {task.amount !== null && (
          <p className="text-xs text-dark-brown/70 mb-0.5">
            ¥{task.amount.toLocaleString()}
          </p>
        )}

        {/* 期限バッジ */}
        {!task.completed && dueBadge(task.dueDate, status)}

        {/* メモ */}
        {task.memo && (
          <p className="text-xs text-dark-brown/60 mt-1 line-clamp-2">{task.memo}</p>
        )}
      </div>

      {/* 削除ボタン */}
      <button
        onClick={() => onDelete(task.id)}
        className="flex-shrink-0 text-rose-brown/40 hover:text-rose-brown transition-colors mt-0.5"
        aria-label="削除"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

const TaskList = ({ tasks, onToggle, onDelete }: TaskListProps) => {
  const incomplete = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => {
      // 期限あり → 昇順、期限なし → 末尾
      if (!a.dueDate && !b.dueDate) return 0
      if (!a.dueDate) return 1
      if (!b.dueDate) return -1
      return a.dueDate.localeCompare(b.dueDate)
    })
  const completed = tasks.filter((t) => t.completed)

  if (tasks.length === 0) {
    return (
      <p className="text-center text-sm text-rose-brown/60 py-4">
        タスクはありません
      </p>
    )
  }

  return (
    <div className="space-y-2">
      {/* 未完了タスク */}
      {incomplete.map((task) => (
        <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
      ))}

      {/* 完了済みタスク */}
      {completed.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-rose-brown/50 mb-2 px-1">完了済み</p>
          {completed.map((task) => (
            <TaskItem key={task.id} task={task} onToggle={onToggle} onDelete={onDelete} />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList
