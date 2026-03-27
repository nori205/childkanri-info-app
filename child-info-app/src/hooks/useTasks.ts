// ===========================
// タスク管理カスタムフック
// ===========================

import { useState, useCallback } from 'react'
import type { Task, TaskFormValues, SubTask } from '../types'

interface UseTasksReturn {
  tasks: Task[]
  addTask: (childId: string, values: TaskFormValues) => void
  toggleTask: (id: string) => void
  deleteTask: (id: string) => void
  getTasksByChildId: (childId: string) => Task[]
  // サブタスク操作
  subTasks: SubTask[]
  addSubTask: (taskId: string, title: string) => void
  toggleSubTask: (id: string) => void
  deleteSubTask: (id: string) => void
  getSubTasksByTaskId: (taskId: string) => SubTask[]
}

// UUIDを簡易生成
const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useTasks = (
  initialTasks: Task[],
  onSave: (tasks: Task[], subTasks: SubTask[]) => void,
  initialSubTasks: SubTask[] = [],
): UseTasksReturn => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)
  const [subTasks, setSubTasks] = useState<SubTask[]>(initialSubTasks)

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
      onSave(updated, subTasks)
    },
    [tasks, subTasks, onSave],
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
      onSave(updated, subTasks)
    },
    [tasks, subTasks, onSave],
  )

  // タスクを削除する（紐付くサブタスクも一緒に削除）
  const deleteTask = useCallback(
    (id: string) => {
      const updatedTasks = tasks.filter((task) => task.id !== id)
      const updatedSubTasks = subTasks.filter((st) => st.taskId !== id)
      setTasks(updatedTasks)
      setSubTasks(updatedSubTasks)
      onSave(updatedTasks, updatedSubTasks)
    },
    [tasks, subTasks, onSave],
  )

  // 子供IDでタスクを絞り込む
  const getTasksByChildId = useCallback(
    (childId: string): Task[] => tasks.filter((t) => t.childId === childId),
    [tasks],
  )

  // サブタスクを追加する
  const addSubTask = useCallback(
    (taskId: string, title: string) => {
      const trimmed = title.trim()
      if (!trimmed) return
      const newSubTask: SubTask = {
        id: generateId(),
        taskId,
        title: trimmed,
        completed: false,
        createdAt: new Date().toISOString(),
      }
      const updated = [...subTasks, newSubTask]
      setSubTasks(updated)
      onSave(tasks, updated)
    },
    [subTasks, tasks, onSave],
  )

  // サブタスクの完了・未完了を切り替える
  const toggleSubTask = useCallback(
    (id: string) => {
      const updated = subTasks.map((st) =>
        st.id === id ? { ...st, completed: !st.completed } : st,
      )
      setSubTasks(updated)
      onSave(tasks, updated)
    },
    [subTasks, tasks, onSave],
  )

  // サブタスクを削除する
  const deleteSubTask = useCallback(
    (id: string) => {
      const updated = subTasks.filter((st) => st.id !== id)
      setSubTasks(updated)
      onSave(tasks, updated)
    },
    [subTasks, tasks, onSave],
  )

  // 親タスクIDでサブタスクを絞り込む
  const getSubTasksByTaskId = useCallback(
    (taskId: string): SubTask[] => subTasks.filter((st) => st.taskId === taskId),
    [subTasks],
  )

  return {
    tasks,
    addTask,
    toggleTask,
    deleteTask,
    getTasksByChildId,
    subTasks,
    addSubTask,
    toggleSubTask,
    deleteSubTask,
    getSubTasksByTaskId,
  }
}
