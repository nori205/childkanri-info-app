// ===========================
// ワクチン記録セクション
// ===========================

import { useState } from 'react'
import {
  Syringe,
  CheckCircle2,
  Circle,
  Clock,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import Accordion from './Accordion'
import type { VaccineRecord, CustomVaccine, VaccineType } from '../../types'
import {
  SCHEDULED_VACCINES,
  OPTIONAL_VACCINES,
  VACCINE_WARN_DAYS,
  VACCINE_HINTS,
} from '../../constants'

// ── 型定義 ────────────────────────────────────────────────

interface VaccineSectionProps {
  vaccineRecords: VaccineRecord[]
  customVaccines: CustomVaccine[]
  onUpsertRecord: (
    vaccineName: string,
    vaccineType: VaccineType,
    vaccinationDate: string,
    nextDate: string,
    memo: string,
  ) => void
  onAddCustom: (values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteCustom: (id: string) => void
}

type VaccineTab = 'scheduled' | 'optional' | 'custom'

// ── ユーティリティ ────────────────────────────────────────

// 今日の日付文字列（YYYY-MM-DD）
const todayStr = (): string => new Date().toISOString().slice(0, 10)

// N日後の日付文字列
const daysLaterStr = (n: number): string => {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}

// 日付を日本語形式に変換
const formatDate = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}/${d.getMonth() + 1}/${d.getDate()}`
}

// 次回予定日が警告範囲内かチェック
const isNextDateWarning = (nextDate: string): boolean => {
  if (!nextDate) return false
  const t = todayStr()
  const limit = daysLaterStr(VACCINE_WARN_DAYS)
  return nextDate >= t && nextDate <= limit
}

// ── 定期・任意ワクチン行コンポーネント ────────────────────

interface VaccineRowProps {
  name: string
  vaccineType: VaccineType
  record: VaccineRecord | undefined
  onSave: (vaccinationDate: string, nextDate: string, memo: string) => void
}

const VaccineRow = ({ name, vaccineType, record, onSave }: VaccineRowProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const [form, setForm] = useState({
    vaccinationDate: record?.vaccinationDate ?? '',
    nextDate: record?.nextDate ?? '',
    memo: record?.memo ?? '',
  })

  const isVaccinated = !!record?.vaccinationDate
  const nextWarning = record?.nextDate ? isNextDateWarning(record.nextDate) : false

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name: field, value } = e.target
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const handleSave = () => {
    onSave(form.vaccinationDate, form.nextDate, form.memo)
    setIsOpen(false)
  }

  const handleCancel = () => {
    // 保存済みの値に戻す
    setForm({
      vaccinationDate: record?.vaccinationDate ?? '',
      nextDate: record?.nextDate ?? '',
      memo: record?.memo ?? '',
    })
    setIsOpen(false)
  }

  return (
    <div className="border border-pink-soft/50 rounded-xl overflow-hidden">
      {/* 行ヘッダー */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center gap-3 px-3 py-2.5 bg-white hover:bg-cream/60 transition-colors text-left"
      >
        {/* 接種状態アイコン */}
        {isVaccinated ? (
          <CheckCircle2 size={18} className="text-pink-muted flex-shrink-0" fill="currentColor" />
        ) : (
          <Circle size={18} className="text-rose-brown/30 flex-shrink-0" />
        )}

        {/* ワクチン名 */}
        <span className={`flex-1 text-sm ${isVaccinated ? 'text-dark-brown' : 'text-dark-brown/50'}`}>
          {name}
        </span>

        {/* 接種日 or 次回予定 */}
        <div className="text-right flex-shrink-0">
          {isVaccinated && record?.vaccinationDate && (
            <p className="text-xs text-rose-brown/70">{formatDate(record.vaccinationDate)}</p>
          )}
          {record?.nextDate && (
            <p className={`text-xs font-medium flex items-center gap-0.5 justify-end ${nextWarning ? 'text-orange-500' : 'text-rose-brown/50'}`}>
              {nextWarning && <Clock size={10} />}
              次: {formatDate(record.nextDate)}
            </p>
          )}
        </div>

        {/* 展開矢印 */}
        {isOpen
          ? <ChevronUp size={15} className="text-rose-brown/50 flex-shrink-0" />
          : <ChevronDown size={15} className="text-rose-brown/50 flex-shrink-0" />
        }
      </button>

      {/* 編集フォーム（展開時） */}
      {isOpen && (
        <div className="px-3 pb-3 pt-2 bg-cream/40 border-t border-pink-soft/40 space-y-2">
          {/* 推奨時期ヒント */}
          {VACCINE_HINTS[name] && (
            <p className="text-xs text-rose-brown/70 bg-white rounded-lg px-3 py-2 border border-pink-soft/40">
              📅 {VACCINE_HINTS[name]}
            </p>
          )}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <p className="text-xs text-rose-brown mb-1">接種日</p>
              <input
                type="date"
                name="vaccinationDate"
                value={form.vaccinationDate}
                onChange={handleChange}
                className="w-full border border-pink-soft rounded-lg px-2 py-1.5 bg-white text-dark-brown text-xs focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            </div>
            <div>
              <p className="text-xs text-rose-brown mb-1">次回予定日</p>
              <input
                type="date"
                name="nextDate"
                value={form.nextDate}
                onChange={handleChange}
                className="w-full border border-pink-soft rounded-lg px-2 py-1.5 bg-white text-dark-brown text-xs focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            </div>
          </div>
          <input
            type="text"
            name="memo"
            value={form.memo}
            onChange={handleChange}
            placeholder="メモ（任意）"
            className="w-full border border-pink-soft rounded-lg px-2 py-1.5 bg-white text-dark-brown text-xs placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
          />
          <div className="flex gap-2">
            <button
              onClick={handleCancel}
              className="flex-1 py-1.5 rounded-lg border border-pink-soft text-rose-brown text-xs hover:bg-pink-soft/30 transition-colors"
            >
              キャンセル
            </button>
            <button
              onClick={handleSave}
              className={`flex-1 py-1.5 rounded-lg text-cream text-xs font-medium transition-opacity ${
                vaccineType === 'scheduled' ? 'bg-pink-muted' : 'bg-rose-brown'
              } hover:opacity-90`}
            >
              保存する
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// ── 個別追加ワクチン行コンポーネント ─────────────────────

interface CustomVaccineRowProps {
  vaccine: CustomVaccine
  onDelete: (id: string) => void
}

const CustomVaccineRow = ({ vaccine, onDelete }: CustomVaccineRowProps) => {
  const isVaccinated = !!vaccine.vaccinationDate
  const nextWarning = vaccine.nextDate ? isNextDateWarning(vaccine.nextDate) : false

  return (
    <div className="bg-white rounded-xl p-3 border border-pink-soft/60 flex items-start gap-3">
      <div className="mt-0.5 flex-shrink-0">
        {isVaccinated ? (
          <CheckCircle2 size={17} className="text-pink-muted" fill="currentColor" />
        ) : (
          <Circle size={17} className="text-rose-brown/30" />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-dark-brown">{vaccine.name}</p>
        {vaccine.reason && (
          <p className="text-xs text-dark-brown/60 mb-0.5">理由：{vaccine.reason}</p>
        )}
        <div className="flex gap-3 flex-wrap">
          {vaccine.vaccinationDate && (
            <span className="text-xs text-rose-brown/70">
              接種：{formatDate(vaccine.vaccinationDate)}
            </span>
          )}
          {vaccine.nextDate && (
            <span className={`text-xs font-medium flex items-center gap-0.5 ${nextWarning ? 'text-orange-500' : 'text-rose-brown/50'}`}>
              {nextWarning && <Clock size={10} />}
              次: {formatDate(vaccine.nextDate)}
            </span>
          )}
        </div>
        {vaccine.memo && (
          <p className="text-xs text-dark-brown/60 mt-0.5">{vaccine.memo}</p>
        )}
      </div>
      <button
        onClick={() => onDelete(vaccine.id)}
        className="text-rose-brown/40 hover:text-rose-brown transition-colors flex-shrink-0"
        aria-label="削除"
      >
        <Trash2 size={15} />
      </button>
    </div>
  )
}

// ── 個別追加フォーム ─────────────────────────────────────

interface CustomAddFormProps {
  onAdd: (values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => void
  onCancel: () => void
}

const emptyCustomForm = () => ({
  name: '',
  reason: '',
  vaccinationDate: '',
  nextDate: '',
  memo: '',
})

const CustomAddForm = ({ onAdd, onCancel }: CustomAddFormProps) => {
  const [form, setForm] = useState(emptyCustomForm)
  const [error, setError] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (name === 'name' && error) setError('')
  }

  const handleAdd = () => {
    if (!form.name.trim()) {
      setError('ワクチン名を入力してください')
      return
    }
    onAdd({ ...form, name: form.name.trim() })
  }

  return (
    <div className="bg-white rounded-xl p-4 border border-pink-soft/60 space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-dark-brown">ワクチンを追加</p>
        <button onClick={onCancel} className="text-rose-brown/50 hover:text-rose-brown">
          <X size={16} />
        </button>
      </div>

      {/* ワクチン名（必須） */}
      <div>
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="ワクチン名 *"
          className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
        />
        {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
      </div>

      {/* 接種理由 */}
      <input
        type="text"
        name="reason"
        value={form.reason}
        onChange={handleChange}
        placeholder="接種理由（任意）"
        className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
      />

      {/* 接種日・次回予定日 */}
      <div className="grid grid-cols-2 gap-2">
        <div>
          <p className="text-xs text-rose-brown mb-1">接種日</p>
          <input
            type="date"
            name="vaccinationDate"
            value={form.vaccinationDate}
            onChange={handleChange}
            className="w-full border border-pink-soft rounded-lg px-2 py-1.5 bg-cream text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-pink-muted"
          />
        </div>
        <div>
          <p className="text-xs text-rose-brown mb-1">次回予定日</p>
          <input
            type="date"
            name="nextDate"
            value={form.nextDate}
            onChange={handleChange}
            className="w-full border border-pink-soft rounded-lg px-2 py-1.5 bg-cream text-dark-brown text-sm focus:outline-none focus:ring-2 focus:ring-pink-muted"
          />
        </div>
      </div>

      {/* メモ */}
      <textarea
        name="memo"
        value={form.memo}
        onChange={handleChange}
        placeholder="メモ（任意）"
        rows={2}
        className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted resize-none"
      />

      <div className="flex gap-2">
        <button
          onClick={onCancel}
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
  )
}

// ── メインコンポーネント ──────────────────────────────────

const VaccineSection = ({
  vaccineRecords,
  customVaccines,
  onUpsertRecord,
  onAddCustom,
  onDeleteCustom,
}: VaccineSectionProps) => {
  const [activeTab, setActiveTab] = useState<VaccineTab>('scheduled')
  const [showCustomForm, setShowCustomForm] = useState(false)

  // 接種済み合計（バッジ表示用）
  const vaccinatedCount =
    vaccineRecords.filter((r) => r.vaccinationDate).length +
    customVaccines.filter((cv) => cv.vaccinationDate).length

  // タブの設定
  const tabs: { key: VaccineTab; label: string }[] = [
    { key: 'scheduled', label: '定期接種' },
    { key: 'optional', label: '任意接種' },
    { key: 'custom', label: '個別追加' },
  ]

  // 指定ワクチン名のレコードを取得
  const getRecord = (name: string) =>
    vaccineRecords.find((r) => r.vaccineName === name)

  return (
    <Accordion
      title="ワクチン記録"
      icon={<Syringe size={18} />}
      count={vaccinatedCount > 0 ? vaccinatedCount : undefined}
    >
      {/* 3タブ切り替え */}
      <div className="flex gap-1 mb-4 bg-cream rounded-xl p-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-all ${
              activeTab === tab.key
                ? 'bg-pink-muted text-cream shadow-sm'
                : 'text-rose-brown hover:bg-pink-soft/40'
            }`}
          >
            {tab.label}
            {/* 定期・任意タブに接種済み件数を表示 */}
            {tab.key !== 'custom' && (() => {
              const master = tab.key === 'scheduled' ? SCHEDULED_VACCINES : OPTIONAL_VACCINES
              const cnt = master.filter((n) => getRecord(n)?.vaccinationDate).length
              return cnt > 0
                ? <span className="ml-1 opacity-80">({cnt}/{master.length})</span>
                : null
            })()}
            {tab.key === 'custom' && customVaccines.length > 0 && (
              <span className="ml-1 opacity-80">({customVaccines.length})</span>
            )}
          </button>
        ))}
      </div>

      {/* ── 定期接種タブ ── */}
      {activeTab === 'scheduled' && (
        <div className="space-y-1.5">
          {SCHEDULED_VACCINES.map((name) => (
            <VaccineRow
              key={name}
              name={name}
              vaccineType="scheduled"
              record={getRecord(name)}
              onSave={(vd, nd, memo) => onUpsertRecord(name, 'scheduled', vd, nd, memo)}
            />
          ))}
        </div>
      )}

      {/* ── 任意接種タブ ── */}
      {activeTab === 'optional' && (
        <div className="space-y-1.5">
          {OPTIONAL_VACCINES.map((name) => (
            <VaccineRow
              key={name}
              name={name}
              vaccineType="optional"
              record={getRecord(name)}
              onSave={(vd, nd, memo) => onUpsertRecord(name, 'optional', vd, nd, memo)}
            />
          ))}
        </div>
      )}

      {/* ── 個別追加タブ ── */}
      {activeTab === 'custom' && (
        <div className="space-y-2">
          {/* 登録済みの個別ワクチン */}
          {customVaccines.map((cv) => (
            <CustomVaccineRow key={cv.id} vaccine={cv} onDelete={onDeleteCustom} />
          ))}

          {/* 追加フォーム or 追加ボタン */}
          {showCustomForm ? (
            <CustomAddForm
              onAdd={(values) => {
                onAddCustom(values)
                setShowCustomForm(false)
              }}
              onCancel={() => setShowCustomForm(false)}
            />
          ) : (
            <button
              onClick={() => setShowCustomForm(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-pink-muted/60 text-sm text-rose-brown hover:bg-pink-soft/30 transition-colors"
            >
              <Plus size={15} />
              ワクチンを追加
            </button>
          )}
        </div>
      )}
    </Accordion>
  )
}

export default VaccineSection
