// ===========================
// 共通アコーディオンコンポーネント
// ===========================

import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'

interface AccordionProps {
  title: string
  icon: React.ReactNode
  // アイテム件数バッジ（0のときは非表示）
  count?: number
  children: React.ReactNode
  defaultOpen?: boolean
}

const Accordion = ({
  title,
  icon,
  count,
  children,
  defaultOpen = false,
}: AccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="bg-pink-soft rounded-2xl shadow-sm overflow-hidden">
      {/* ヘッダー */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2 text-dark-brown font-semibold">
          <span className="text-rose-brown">{icon}</span>
          <span>{title}</span>
          {/* 件数バッジ */}
          {count !== undefined && count > 0 && (
            <span className="bg-pink-muted text-cream text-xs font-bold px-2 py-0.5 rounded-full">
              {count}
            </span>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-rose-brown flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-rose-brown flex-shrink-0" />
        )}
      </button>

      {/* コンテンツ */}
      {isOpen && <div className="px-5 pb-5">{children}</div>}
    </div>
  )
}

export default Accordion
