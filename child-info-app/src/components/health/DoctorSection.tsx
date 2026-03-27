// ===========================
// かかりつけ医セクション
// ===========================

import { useState } from 'react'
import { Stethoscope, Phone, Trash2, Plus, X, Lock, Pencil } from 'lucide-react'
import Accordion from './Accordion'
import type { Doctor } from '../../types'
import { SPECIALTY_OPTIONS, FREE_HEALTH_LIMIT } from '../../constants'

interface DoctorSectionProps {
  doctors: Doctor[]
  onAdd: (values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => void
  // 無料・有料制御（省略時は制限なし）
  isUnlocked?: boolean
  onUnlockClick?: () => void
}

// フォームの初期値
const emptyForm = () => ({
  specialty: '小児科',
  hospitalName: '',
  phone: '',
  patientCardNumber: '',
  memo: '',
})

const DoctorSection = ({ doctors, onAdd, onDelete, onUpdate, isUnlocked = true, onUnlockClick }: DoctorSectionProps) => {
  // 無料版で追加上限に達しているか
  const isLimitReached = !isUnlocked && doctors.length >= FREE_HEALTH_LIMIT
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'hospitalName' && error) setError('')
  }

  const openNewForm = () => {
    setEditingId(null)
    setForm(emptyForm())
    setError('')
    setShowForm(true)
  }

  const openEditForm = (doc: Doctor) => {
    setEditingId(doc.id)
    setForm({
      specialty: doc.specialty,
      hospitalName: doc.hospitalName,
      phone: doc.phone,
      patientCardNumber: doc.patientCardNumber,
      memo: doc.memo,
    })
    setError('')
    setShowForm(true)
  }

  const handleSave = () => {
    if (!form.hospitalName.trim()) {
      setError('病院名を入力してください')
      return
    }
    if (editingId) {
      onUpdate(editingId, { ...form, hospitalName: form.hospitalName.trim() })
    } else {
      onAdd({ ...form, hospitalName: form.hospitalName.trim() })
    }
    setForm(emptyForm())
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  const handleCancel = () => {
    setForm(emptyForm())
    setShowForm(false)
    setEditingId(null)
    setError('')
  }

  return (
    <Accordion
      title="かかりつけ医"
      icon={<Stethoscope size={18} />}
      count={doctors.length}
    >
      {/* 登録済みリスト */}
      {doctors.length > 0 && (
        <div className="space-y-2 mb-4">
          {doctors.map((doc) => (
            <div
              key={doc.id}
              className="bg-white rounded-xl p-3 border border-pink-soft/60 flex items-start gap-3"
            >
              <div className="flex-1 min-w-0">
                {/* 診療科バッジ＋病院名 */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-xs bg-cream text-rose-brown px-2 py-0.5 rounded-md border border-pink-soft">
                    {doc.specialty}
                  </span>
                  <span className="text-sm font-semibold text-dark-brown">
                    {doc.hospitalName}
                  </span>
                </div>
                {/* 電話番号 */}
                {doc.phone && (
                  <div className="flex items-center gap-1 text-xs text-rose-brown/80 mb-0.5">
                    <Phone size={11} />
                    <a href={`tel:${doc.phone}`} className="hover:underline">
                      {doc.phone}
                    </a>
                  </div>
                )}
                {/* 診察券番号 */}
                {doc.patientCardNumber && (
                  <div className="text-xs text-rose-brown/80 mb-0.5">
                    診察券番号：{doc.patientCardNumber}
                  </div>
                )}
                {/* メモ */}
                {doc.memo && (
                  <p className="text-xs text-dark-brown/60 mt-1">{doc.memo}</p>
                )}
              </div>
              {/* 編集ボタン */}
              <button
                onClick={() => openEditForm(doc)}
                className="text-rose-brown/40 hover:text-rose-brown transition-colors flex-shrink-0"
                aria-label="編集"
              >
                <Pencil size={14} />
              </button>
              {/* 削除ボタン */}
              <button
                onClick={() => onDelete(doc.id)}
                className="text-rose-brown/40 hover:text-rose-brown transition-colors flex-shrink-0"
                aria-label="削除"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 追加・編集フォーム（インライン展開） */}
      {showForm ? (
        <div className="bg-white rounded-xl p-4 border border-pink-soft/60 space-y-3">
          {/* フォームヘッダー */}
          <div className="flex items-center justify-between">
            <p className="text-sm font-medium text-dark-brown">
              {editingId ? '編集' : '新規追加'}
            </p>
            <button
              onClick={handleCancel}
              className="text-rose-brown/50 hover:text-rose-brown"
            >
              <X size={16} />
            </button>
          </div>

          {/* 診療科 */}
          <select
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
            className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-pink-muted"
          >
            {SPECIALTY_OPTIONS.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          {/* 病院名（必須） */}
          <div>
            <input
              type="text"
              name="hospitalName"
              value={form.hospitalName}
              onChange={handleChange}
              placeholder="病院名 *"
              list="doctor-hospital-suggestions"
              className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
            <datalist id="doctor-hospital-suggestions">
              {doctors.map((d) => d.hospitalName).filter(Boolean).filter((v, i, a) => a.indexOf(v) === i).map((v) => (
                <option key={v} value={v} />
              ))}
            </datalist>
            {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
          </div>

          {/* 電話番号 */}
          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="電話番号（任意）"
            className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
          />

          {/* 診察券番号 */}
          <input
            type="text"
            name="patientCardNumber"
            value={form.patientCardNumber}
            onChange={handleChange}
            placeholder="診察券番号（任意）"
            className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
          />

          {/* メモ */}
          <textarea
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="メモ（任意）"
            rows={2}
            className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted resize-none"
          />

          {/* 操作ボタン */}
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-2 rounded-lg border border-pink-soft text-rose-brown text-sm hover:bg-pink-soft/30 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 rounded-lg bg-pink-muted text-cream text-sm font-medium hover:opacity-90 transition-opacity"
            >
              {editingId ? '保存する' : '追加する'}
            </button>
          </div>
        </div>
      ) : isLimitReached ? (
        // 無料上限到達時のロックCTA
        <button
          onClick={onUnlockClick}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-rose-brown/30 text-sm text-rose-brown/60 hover:bg-pink-soft/30 transition-colors"
        >
          <Lock size={15} />
          無料は{FREE_HEALTH_LIMIT}件まで（解除して追加する）
        </button>
      ) : (
        // 追加ボタン
        <button
          onClick={openNewForm}
          className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-pink-muted/60 text-sm text-rose-brown hover:bg-pink-soft/30 transition-colors"
        >
          <Plus size={15} />
          かかりつけ医を追加
        </button>
      )}
    </Accordion>
  )
}

export default DoctorSection
