// ===========================
// 経験者の気づきメモセクション
// ===========================

import { useState, useEffect } from 'react'
import { Lightbulb, Save } from 'lucide-react'
import Accordion from './Accordion'
import type { HealthMemo } from '../../types'

interface HealthMemoSectionProps {
  healthMemo: HealthMemo | null
  onSave: (content: string) => void
}

const HealthMemoSection = ({ healthMemo, onSave }: HealthMemoSectionProps) => {
  const [content, setContent] = useState(healthMemo?.content ?? '')
  const [saved, setSaved] = useState(false)

  // 子供タブが切り替わったときに内容を同期する
  useEffect(() => {
    setContent(healthMemo?.content ?? '')
    setSaved(false)
  }, [healthMemo])

  const handleSave = () => {
    onSave(content)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <Accordion
      title="気づきメモ"
      icon={<Lightbulb size={18} />}
    >
      <div className="space-y-3">
        {/* 入力例のヒント */}
        <p className="text-xs text-rose-brown/60">
          例：「点滴の針が刺しにくい」「白衣恐怖症」「左腕から採血しやすい」など
        </p>

        {/* テキストエリア */}
        <textarea
          value={content}
          onChange={(e) => {
            setContent(e.target.value)
            setSaved(false)
          }}
          placeholder="この子についての気づきを自由に記録してください..."
          rows={5}
          className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted resize-none"
        />

        {/* 保存ボタン */}
        <button
          onClick={handleSave}
          className="w-full flex items-center justify-center gap-2 bg-pink-muted text-cream py-2.5 rounded-xl text-sm font-medium shadow hover:opacity-90 active:opacity-80 transition-opacity"
        >
          <Save size={15} />
          {saved ? '保存しました！' : '保存する'}
        </button>
      </div>
    </Accordion>
  )
}

export default HealthMemoSection
