// ===========================
// アレルギー・食事制限セクション
// ===========================

import { useState } from 'react'
import { ShieldAlert, Trash2, Plus, X } from 'lucide-react'
import Accordion from './Accordion'
import type { Allergy, AllergySeverity } from '../../types'
import { ALLERGY_SEVERITIES, SEVERITY_COLOR } from '../../constants'

interface AllergySectionProps {
  allergies: Allergy[]
  onAdd: (values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => void
  onDelete: (id: string) => void
}

const emptyForm = () => ({
  allergen: '',
  severity: '中' as AllergySeverity,
  treatment: '',
  memo: '',
})

const AllergySection = ({ allergies, onAdd, onDelete }: AllergySectionProps) => {
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'allergen' && error) setError('')
  }

  const handleAdd = () => {
    if (!form.allergen.trim()) {
      setError('アレルゲン名を入力してください')
      return
    }
    onAdd({ ...form, allergen: form.allergen.trim() })
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
      title="アレルギー・食事制限"
      icon={<ShieldAlert size={18} />}
      count={allergies.length}
    >
      {/* 登録済みリスト */}
      {allergies.length > 0 && (
        <div className="space-y-2 mb-4">
          {allergies.map((al) => (
            <div
              key={al.id}
              className="bg-white rounded-xl p-3 border border-pink-soft/60 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                {/* アレルゲン名＋重症度バッジ */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-sm font-semibold text-dark-brown">
                    {al.allergen}
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full border font-medium ${SEVERITY_COLOR[al.severity]}`}
                  >
                    {al.severity}度
                  </span>
                </div>
                {/* 対処法 */}
                {al.treatment && (
                  <p className="text-xs text-dark-brown/70 mb-0.5">
                    対処法：{al.treatment}
                  </p>
                )}
                {/* メモ */}
                {al.memo && (
                  <p className="text-xs text-dark-brown/60 mt-0.5">{al.memo}</p>
                )}
              </div>
              {/* 削除ボタン */}
              <button
                onClick={() => onDelete(al.id)}
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

          {/* アレルゲン名（必須） */}
          <div>
            <input
              type="text"
              name="allergen"
              value={form.allergen}
              onChange={handleChange}
              placeholder="アレルゲン名 *（例：卵、牛乳、そば）"
              className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          {/* 重症度 */}
          <div>
            <p className="text-xs text-rose-brown mb-1.5">重症度</p>
            <div className="flex gap-2">
              {ALLERGY_SEVERITIES.map((sv) => (
                <button
                  key={sv}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, severity: sv }))}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-medium border transition-all ${
                    form.severity === sv
                      ? SEVERITY_COLOR[sv] + ' shadow-sm'
                      : 'border-pink-soft text-rose-brown/60 hover:bg-pink-soft/30'
                  }`}
                >
                  {sv}
                </button>
              ))}
            </div>
          </div>

          {/* 対処法 */}
          <input
            type="text"
            name="treatment"
            value={form.treatment}
            onChange={handleChange}
            placeholder="対処法（任意）"
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
          アレルギーを追加
        </button>
      )}
    </Accordion>
  )
}

export default AllergySection
