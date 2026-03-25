// ===========================
// タスク管理カスタムフック
// ===========================

import { useState, useCallback } from 'react'
import type { Task, TaskFormValues } from '../types'

interface UseTasksReturn {
  tasks: Task[]
  addTask: (childId: string, values: TaskFormValues) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  getTasksByChildId: (childId: string) => Task[]
}

// UUIDを簡易生成
const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useTasks = (
  initialTasks: Task[],
  onSave: (tasks: Task[]) => void,
): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  // タスクを追加する
  const addTask = useCallback(
    (childId: string, values: TaskFormValues) => {
      const now = new Date().toISOString()
      const newTask: Task = {
        id: generateId(),
        childId,
        title: values.title.trim(),
        category: values.category,
        dueDate: values.dueDate || null,
        memo: values.memo.trim(),
        // 支払い・入金のときのみ金額を保存
        amount:
          values.category === '支払い・入金' && values.amount !== ''
            ? Number(values.amount)
            : null,
        completed: false,
        createdAt: now,
        updatedAt: now,
      }
      const updated = [...tasks, newTask]
      setTasks(updated)
      onSave(updated)
    },
    [tasks, onSave],
  )

  // 完了・未完了を切り替える
  const toggleTask = useCallback(
    (id: string) => {
      const updated = tasks.map((task) =>
        task.id === id
          ? { ...task, completed: !task.completed, updatedAt: new Date().toISOString() }
          : task,
      )
      setTasks(updated)
      onSave(updated)
    },
    [tasks, onSave],
  )

  // タスクを削除する
  const deleteTask = useCallback(
    (id: string) => {
      const updated = tasks.filter((task) => task.id !== id)
      setTasks(updated)
      onSave(updated)
    },
    [tasks, onSave],
  )

  // 子供IDでタスクを絞り込む
  const getTasksByChildId = useCallback(
    (childId: string): Task[] => tasks.filter((t) => t.childId === childId),
    [tasks],
  )

  return { tasks, addTask, toggleTask, deleteTask, getTasksByChildId }
}
