// ===========================
// 病気履歴セクション
// ===========================

import { useState } from 'react'
import { Thermometer, Trash2, Plus, X, CalendarDays } from 'lucide-react'
import Accordion from './Accordion'
import type { Illness } from '../../types'

interface IllnessSectionProps {
  illnesses: Illness[]
  onAdd: (values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => void
  onDelete: (id: string) => void
}

const emptyForm = () => ({
  name: '',
  onsetDate: '',
  recoveryDate: '',
  treatment: '',
  memo: '',
})

// 日付を日本語形式に変換
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const IllnessSection = ({ illnesses, onAdd, onDelete }: IllnessSectionProps) => {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'name' && error) setError('')
  }

  const handleAdd = () => {
    if (!form.name.trim()) {
      setError('病名を入力してください')
      return
    }
    onAdd({ ...form, name: form.name.trim() })
    setForm(emptyForm)
    setShowForm(false)
    setError('')
  }

  const handleCancel = () => {
    setForm(emptyForm)
    setShowForm(false)
    setError('')
  }

  return (
    <Accordion
      title="病気履歴"
      icon={<Thermometer size={18} />}
      count={illnesses.length}
    >
      {/* 登録済みリスト（新しい順） */}
      {illnesses.length > 0 && (
        <div className="space-y-2 mb-4">
          {illnesses.map((il) => (
            <div
              key={il.id}
              className="bg-white rounded-xl p-3 border border-pink-soft/60 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                {/* 病名 */}
                <p className="text-sm font-semibold text-dark-brown mb-1">
                  {il.name}
                </p>
                {/* 発症日〜回復日 */}
                <div className="flex items-center gap-1 text-xs text-rose-brown/70 mb-0.5">
                  <CalendarDays size={11} />
                  <span>{formatDate(il.onsetDate)}</span>
                  {il.recoveryDate && (
                    <>
                      <span>〜</span>
                      <span>{formatDate(il.recoveryDate)}</span>
                    </>
                  )}
                  {!il.recoveryDate && il.onsetDate && (
                    <span className="text-orange-400">（回復日未記入）</span>
                  )}
                </div>
                {/* 治療内容 */}
                {il.treatment && (
                  <p className="text-xs text-dark-brown/70 mb-0.5">
                    治療：{il.treatment}
                  </p>
                )}
                {/* 経験者メモ */}
                {il.memo && (
                  <p className="text-xs text-dark-brown/60 mt-0.5">{il.memo}</p>
                )}
              </div>
              {/* 削除ボタン */}
              <button
                onClick={() => onDelete(il.id)}
                className="text-rose-brown/40 hover:text-rose-brown transition-colors flex-shrink-0"
                aria-label="削除"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 追加フォーム */}
      {showForm ? (
        <div className="bg-white rounded-xl p-4 border border-pink-soft/60 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-dark-brown">新規追加</p>
            <button
              onClick={handleCancel}
              className="text-rose-brown/50 hover:text-rose-brown"
            >
              <X size={16} />
            </button>
          </div>

          {/* 病名（必須） */}
          <div>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="病名 *（例：インフルエンザ）"
              className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          {/* 発症日・回復日 */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-rose-brown mb-1">発症日</p>
              <input
                type="date"
                name="onsetDate"
                value={form.onsetDate}
                onChange={handleChange}
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            </div>
            <div>
              <p className="text-xs text-rose-brown mb-1">回復日（任意）</p>
              <input
                type="date"
                name="recoveryDate"
                value={form.recoveryDate}
                onChange={handleChange}
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            </div>
          </div>

          {/* 治療内容 */}
          <input
            type="text"
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            placeholder="治療内容（任意）"
            className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
          />

          {/* 経験者メモ */}
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="経験者メモ（任意）"
            rows={2}
            className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted resize-none"
          />

          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-2 rounded-lg border border-pink-soft text-rose-brown text-sm hover:bg-pink-soft/30 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleAdd}
              className="flex-1 py-2 rounded-lg bg-pink-muted text-cream text-sm font-medium hover:opacity-90 transition-opacity"
            >
              追加する
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-pink-muted/60 text-sm text-rose-brown hover:bg-pink-soft/30 transition-colors"
        >
          <Plus size={15} />
          病気を追加
        </button>
      )}
    </Accordion>
  )
}

export default IllnessSection
