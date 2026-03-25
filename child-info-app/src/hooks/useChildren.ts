// ===========================
// 子供データ管理カスタムフック
// ===========================

import { useState, useCallback } from 'react'
import type { Child, ChildFormValues } from '../types'

// 子供データの操作インターフェース
interface UseChildrenReturn {
  children: Child[]
  activeChildId: string | null
  setActiveChildId: (id: string | null) => void
  addChild: (values: ChildFormValues) => void
  updateChild: (id: string, values: ChildFormValues) => void
  deleteChild: (id: string) => void
}

// UUIDを簡易生成（外部ライブラリ不使用）
const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useChildren = (
  initialChildren: Child[],
  onSave: (children: Child[]) => void,
): UseChildrenReturn => {
  const [children, setChildren] = useState<Child[]>(initialChildren)
  const [activeChildId, setActiveChildId] = useState<string | null>(
    initialChildren[0]?.id ?? null,
  )

  // 子供を追加する
  const addChild = useCallback(
    (values: ChildFormValues) => {
      const now = new Date().toISOString()
      const newChild: Child = {
        id: generateId(),
        ...values,
        createdAt: now,
        updatedAt: now,
      }
      const updated = [...children, newChild]
      setChildren(updated)
      setActiveChildId(newChild.id)
      onSave(updated)
    },
    [children, onSave],
  )

  // 子供情報を更新する
  const updateChild = useCallback(
    (id: string, values: ChildFormValues) => {
      const updated = children.map((child) =>
        child.id === id
          ? { ...child, ...values, updatedAt: new Date().toISOString() }
          : child,
      )
      setChildren(updated)
      onSave(updated)
    },
    [children, onSave],
  )

  // 子供を削除する
  const deleteChild = useCallback(
    (id: string) => {
      const updated = children.filter((child) => child.id !== id)
      setChildren(updated)
      // 削除後のアクティブタブを調整
      if (activeChildId === id) {
        setActiveChildId(updated[0]?.id ?? null)
      }
      onSave(updated)
    },
    [children, activeChildId, onSave],
  )

  return {
    children,
    activeChildId,
    setActiveChildId,
    addChild,
    updateChild,
    deleteChild,
  }
}
