// ===========================
// タスクリストコンポーネント
// ===========================

import { useState, useRef } from 'react'
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
  ChevronDown,
  ChevronUp,
  Plus,
  CalendarDays,
} from 'lucide-react'
import type { Task, TaskCategory, SubTask } from '../types'
import { DUE_WARN_DAYS } from '../constants'

interface TaskListProps {
  tasks: Task[]
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  // サブタスク関連 props
  subTasks: SubTask[]
  onAddSubTask: (taskId: string, title: string) => void
  onToggleSubTask: (id: string) => void
  onDeleteSubTask: (id: string) => void
  getSubTasksByTaskId: (taskId: string) => SubTask[]
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
  taskSubTasks,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
}: {
  task: Task
  onToggle: (id: string) => void
  onDelete: (id: string) => void
  taskSubTasks: SubTask[]
  onAddSubTask: (taskId: string, title: string) => void
  onToggleSubTask: (id: string) => void
  onDeleteSubTask: (id: string) => void
}) => {
  const status = getDueStatus(task.dueDate)

  // サブタスクエリアの展開状態（ローカル管理）
  const [isExpanded, setIsExpanded] = useState(false)
  // インライン入力欄の表示状態
  const [isAddingSubTask, setIsAddingSubTask] = useState(false)
  // サブタスク入力値
  const [subTaskInput, setSubTaskInput] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  // サブタスクの完了数・全件数
  const subTotal = taskSubTasks.length
  const subDone = taskSubTasks.filter((st) => st.completed).length
  // 全サブタスクが完了しているか
  const allSubDone = subTotal > 0 && subDone === subTotal
  // サブタスクがある場合はイベント扱い（完了ボタン非表示）
  const isEvent = taskSubTasks.length > 0

  // 展開ボタン押下
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev)
    // 折りたたむときはインライン入力も閉じる
    if (isExpanded) {
      setIsAddingSubTask(false)
      setSubTaskInput('')
    }
  }

  // 「＋ サブタスクを追加」ボタン押下
  const handleShowAddInput = () => {
    setIsAddingSubTask(true)
    // 少し待ってからフォーカスを当てる
    setTimeout(() => inputRef.current?.focus(), 50)
  }

  // サブタスク保存処理
  const handleSaveSubTask = () => {
    if (subTaskInput.trim()) {
      onAddSubTask(task.id, subTaskInput)
      setSubTaskInput('')
    }
    setIsAddingSubTask(false)
  }

  // Enterキーで保存、Escapeでキャンセル
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveSubTask()
    } else if (e.key === 'Escape') {
      setIsAddingSubTask(false)
      setSubTaskInput('')
    }
  }

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
    <div className={`rounded-xl border ${borderClass} transition-all`}>
      {/* メインタスク行 */}
      <div className="flex items-start gap-3 p-3">
        {/* チェックボタン（イベントタスクは非表示） */}
        {!isEvent ? (
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
        ) : (
          // イベントタスクはアイコンのみ（完了ボタンなし）
          <span className="mt-0.5 flex-shrink-0 w-[22px]" />
        )}

        {/* タスク情報 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className={`text-rose-brown/70 ${task.completed ? 'opacity-50' : ''}`}>
              {isEvent
                ? <CalendarDays size={15} className="flex-shrink-0" />
                : <CategoryIcon category={task.category[0]} />
              }
            </span>
            <span
              className={`text-sm font-medium text-dark-brown ${
                task.completed ? 'line-through text-dark-brown/40' : ''
              }`}
            >
              {task.title}
            </span>
            {/* サブタスク件数バッジ（1件以上のとき表示） */}
            {subTotal > 0 && (
              <span className="text-xs text-rose-brown/60 ml-0.5">
                {subDone}/{subTotal}
              </span>
            )}
            {/* 全完了バッジ */}
            {allSubDone && (
              <span className="bg-emerald-100 text-emerald-700 text-xs px-1.5 py-0.5 rounded-md">
                全完了
              </span>
            )}
          </div>

          {/* 種類ラベル（複数表示） */}
          <div className="flex flex-wrap gap-1 mb-1">
            {task.category.map((cat) => (
              <span key={cat} className="inline-block text-xs text-rose-brown/60 bg-cream px-1.5 py-0.5 rounded-md">
                {cat}
              </span>
            ))}
          </div>

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

        {/* 右端ボタン群 */}
        <div className="flex items-center gap-1 flex-shrink-0 mt-0.5">
          {/* 展開/折りたたみトグルボタン */}
          <button
            onClick={handleToggleExpand}
            className="text-rose-brown/40 hover:text-rose-brown transition-colors"
            aria-label={isExpanded ? 'サブタスクを折りたたむ' : 'サブタスクを展開する'}
          >
            {isExpanded ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
          </button>
          {/* 削除ボタン */}
          <button
            onClick={() => onDelete(task.id)}
            className="text-rose-brown/40 hover:text-rose-brown transition-colors"
            aria-label="削除"
          >
            <Trash2 size={15} />
          </button>
        </div>
      </div>

      {/* サブタスクエリア（展開時のみ表示） */}
      {isExpanded && (
        <div className="mx-3 mb-3 bg-cream/60 rounded-lg p-2">
          {/* サブタスク一覧 */}
          {taskSubTasks.length > 0 && (
            <ul className="space-y-1 mb-2">
              {taskSubTasks.map((st) => (
                <li key={st.id} className="flex items-center gap-2">
                  {/* チェックボックス */}
                  <button
                    onClick={() => onToggleSubTask(st.id)}
                    className="flex-shrink-0 text-pink-muted hover:opacity-70 transition-opacity"
                    aria-label={st.completed ? '未完了に戻す' : '完了にする'}
                  >
                    <CheckCircle2
                      size={16}
                      className={st.completed ? 'text-pink-muted/50' : 'text-pink-muted'}
                      fill={st.completed ? 'currentColor' : 'none'}
                    />
                  </button>
                  {/* サブタスクタイトル */}
                  <span
                    className={`flex-1 text-xs text-dark-brown ${
                      st.completed ? 'line-through text-dark-brown/40' : ''
                    }`}
                  >
                    {st.title}
                  </span>
                  {/* 削除ボタン */}
                  <button
                    onClick={() => onDeleteSubTask(st.id)}
                    className="flex-shrink-0 text-rose-brown/30 hover:text-rose-brown transition-colors"
                    aria-label="サブタスクを削除"
                  >
                    <Trash2 size={12} />
                  </button>
                </li>
              ))}
            </ul>
          )}

          {/* インライン入力欄（表示中） */}
          {isAddingSubTask ? (
            <div className="flex items-center gap-1.5">
              <input
                ref={inputRef}
                type="text"
                value={subTaskInput}
                onChange={(e) => setSubTaskInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="サブタスク名を入力"
                className="flex-1 text-xs bg-white border border-pink-soft rounded-md px-2 py-1 text-dark-brown placeholder-rose-brown/40 outline-none focus:border-pink-muted"
              />
              <button
                onClick={handleSaveSubTask}
                className="text-xs bg-pink-muted text-cream px-2 py-1 rounded-md hover:opacity-90 transition-opacity"
              >
                追加
              </button>
              <button
                onClick={() => { setIsAddingSubTask(false); setSubTaskInput('') }}
                className="text-xs text-rose-brown/50 hover:text-rose-brown transition-colors"
              >
                ✕
              </button>
            </div>
          ) : (
            /* 「＋ サブタスクを追加」ボタン */
            <button
              onClick={handleShowAddInput}
              className="flex items-center gap-1 text-xs text-rose-brown/60 hover:text-rose-brown transition-colors"
            >
              <Plus size={11} />
              サブタスクを追加
            </button>
          )}
        </div>
      )}
    </div>
  )
}

const TaskList = ({
  tasks,
  onToggle,
  onDelete,
  subTasks,
  onAddSubTask,
  onToggleSubTask,
  onDeleteSubTask,
  getSubTasksByTaskId,
}: TaskListProps) => {
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

  // subTasks は prop として受け取っているが、getSubTasksByTaskId で個別取得するため
  // lint 警告回避のためダミー参照
  void subTasks

  return (
    <div className="space-y-2">
      {/* 未完了タスク */}
      {incomplete.map((task) => (
        <TaskItem
          key={task.id}
          task={task}
          onToggle={onToggle}
          onDelete={onDelete}
          taskSubTasks={getSubTasksByTaskId(task.id)}
          onAddSubTask={onAddSubTask}
          onToggleSubTask={onToggleSubTask}
          onDeleteSubTask={onDeleteSubTask}
        />
      ))}

      {/* 完了済みタスク */}
      {completed.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-rose-brown/50 mb-2 px-1">完了済み</p>
          {completed.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onToggle={onToggle}
              onDelete={onDelete}
              taskSubTasks={getSubTasksByTaskId(task.id)}
              onAddSubTask={onAddSubTask}
              onToggleSubTask={onToggleSubTask}
              onDeleteSubTask={onDeleteSubTask}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskList
