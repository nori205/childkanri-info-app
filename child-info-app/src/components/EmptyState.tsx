// ===========================
// 子供0人のときの案内コンポーネント
// ===========================

import { Baby } from 'lucide-react'

interface EmptyStateProps {
  onAdd: () => void
}

const EmptyState = ({ onAdd }: EmptyStateProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-dark-brown">
      <Baby size={64} className="text-pink-muted mb-4 opacity-70" />
      <p className="text-lg font-medium mb-2">子供が登録されていません</p>
      <p className="text-sm text-rose-brown mb-8">
        「＋子供を追加」ボタンから登録を始めましょう
      </p>
      <button
        onClick={onAdd}
        className="bg-pink-muted text-cream px-6 py-3 rounded-full font-medium shadow hover:opacity-90 active:opacity-80 transition-opacity"
      >
        ＋ 子供を追加する
      </button>
    </div>
  )
}

export default EmptyState
