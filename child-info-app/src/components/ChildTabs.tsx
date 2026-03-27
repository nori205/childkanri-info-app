// ===========================
// 子供タブ切り替えコンポーネント
// ===========================

import { useState } from 'react'
import { Trash2 } from 'lucide-react'
import type { Child } from '../types'
import ChildCard from './ChildCard'

interface ChildTabsProps {
  children: Child[]
  activeChildId: string | null
  onTabChange: (id: string) => void
  onDeleteChild: (id: string) => void
  showCard?: boolean  // falseのときはChildCardを表示しない（デフォルトtrue）
}

const ChildTabs = ({
  children,
  activeChildId,
  onTabChange,
  onDeleteChild,
  showCard = true,
}: ChildTabsProps) => {
  // 削除確認ダイアログの表示対象
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null)

  const activeChild = children.find((c) => c.id === activeChildId)

  // 削除確認ダイアログを開く
  const handleDeleteClick = (id: string) => {
    setConfirmDeleteId(id)
  }

  // 削除を実行する
  const handleConfirmDelete = () => {
    if (confirmDeleteId) {
      onDeleteChild(confirmDeleteId)
      setConfirmDeleteId(null)
    }
  }

  return (
    <div>
      {/* タブバー */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {children.map((child) => (
          <button
            key={child.id}
            onClick={() => onTabChange(child.id)}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeChildId === child.id
                ? 'bg-pink-muted text-cream shadow'
                : 'bg-pink-soft text-dark-brown hover:bg-pink-muted/50'
            }`}
          >
            {child.name}
          </button>
        ))}

      </div>

      {/* アクティブな子供の情報カード（showCard=trueのときのみ表示） */}
      {showCard && activeChild && (
        <div className="mt-4">
          <ChildCard child={activeChild} />

          {/* 削除ボタン */}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => handleDeleteClick(activeChild.id)}
              className="flex items-center gap-1.5 text-sm text-rose-brown hover:text-dark-brown transition-colors px-3 py-1.5 rounded-lg hover:bg-pink-soft/40"
            >
              <Trash2 size={15} />
              この子を削除
            </button>
          </div>
        </div>
      )}

      {/* 削除確認ダイアログ */}
      {confirmDeleteId && (
        <div
          className="fixed inset-0 bg-dark-brown/40 flex items-center justify-center z-50 px-4"
          onClick={(e) => e.target === e.currentTarget && setConfirmDeleteId(null)}
        >
          <div className="bg-cream rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-dark-brown mb-2">
              本当に削除しますか？
            </h3>
            <p className="text-sm text-rose-brown mb-6">
              「
              {children.find((c) => c.id === confirmDeleteId)?.name}
              」の情報をすべて削除します。この操作は元に戻せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteId(null)}
                className="flex-1 border border-pink-soft text-rose-brown py-2.5 rounded-xl font-medium hover:bg-pink-soft/30 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleConfirmDelete}
                className="flex-1 bg-rose-brown text-cream py-2.5 rounded-xl font-medium shadow hover:opacity-90 transition-opacity"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ChildTabs
