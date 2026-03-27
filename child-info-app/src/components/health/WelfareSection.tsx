// ===========================
// 福祉サービス・診断情報セクション
// ===========================

import { useState } from 'react'
import { Heart, Phone, Plus, Trash2, X, Save } from 'lucide-react'
import Accordion from './Accordion'
import type { WelfareProvider, WelfareConsultant, DiagnosisInfo } from '../../types'

interface WelfareSectionProps {
  welfareProviders: WelfareProvider[]
  welfareConsultants: WelfareConsultant[]
  diagnosisInfo: DiagnosisInfo | null
  onAddProvider: (values: Omit<WelfareProvider, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteProvider: (id: string) => void
  onAddConsultant: (values: Omit<WelfareConsultant, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteConsultant: (id: string) => void
  onUpsertDiagnosis: (values: Omit<DiagnosisInfo, 'childId' | 'updatedAt'>) => void
}

const emptyProvider = () => ({ name: '', phone: '' })
const emptyConsultant = () => ({ name: '', office: '', phone: '' })

const WelfareSection = ({
  welfareProviders,
  welfareConsultants,
  diagnosisInfo,
  onAddProvider,
  onDeleteProvider,
  onAddConsultant,
  onDeleteConsultant,
  onUpsertDiagnosis,
}: WelfareSectionProps) => {
  // 診断・手帳フォーム
  const [diagForm, setDiagForm] = useState({
    diagnosisName: diagnosisInfo?.diagnosisName ?? '',
    hasHandbook: diagnosisInfo?.hasHandbook ?? false,
    handbookName: diagnosisInfo?.handbookName ?? '',
  })
  const [diagSaved, setDiagSaved] = useState(false)

  // 事業者追加フォーム
  const [showProviderForm, setShowProviderForm] = useState(false)
  const [providerForm, setProviderForm] = useState(emptyProvider)
  const [providerError, setProviderError] = useState('')

  // 相談支援専門員追加フォーム
  const [showConsultantForm, setShowConsultantForm] = useState(false)
  const [consultantForm, setConsultantForm] = useState(emptyConsultant)
  const [consultantError, setConsultantError] = useState('')

  const totalCount = welfareProviders.length + welfareConsultants.length

  const handleSaveDiag = () => {
    onUpsertDiagnosis(diagForm)
    setDiagSaved(true)
    setTimeout(() => setDiagSaved(false), 2000)
  }

  const handleAddProvider = () => {
    if (!providerForm.name.trim()) { setProviderError('事業者名を入力してください'); return }
    onAddProvider({ name: providerForm.name.trim(), phone: providerForm.phone.trim() })
    setProviderForm(emptyProvider())
    setShowProviderForm(false)
    setProviderError('')
  }

  const handleAddConsultant = () => {
    if (!consultantForm.name.trim()) { setConsultantError('名前を入力してください'); return }
    onAddConsultant({
      name: consultantForm.name.trim(),
      office: consultantForm.office.trim(),
      phone: consultantForm.phone.trim(),
    })
    setConsultantForm(emptyConsultant())
    setShowConsultantForm(false)
    setConsultantError('')
  }

  return (
    <Accordion
      title="福祉サービス・診断情報"
      icon={<Heart size={18} />}
      count={totalCount > 0 ? totalCount : undefined}
    >
      <div className="space-y-5">

        {/* ── 診断名・手帳 ── */}
        <div>
          <p className="text-xs font-semibold text-dark-brown mb-2">診断名・手帳</p>
          <div className="space-y-2">
            <input
              type="text"
              value={diagForm.diagnosisName}
              onChange={(e) => setDiagForm((p) => ({ ...p, diagnosisName: e.target.value }))}
              placeholder="診断名（例：自閉スペクトラム症）"
              className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-white text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={diagForm.hasHandbook}
                onChange={(e) => setDiagForm((p) => ({ ...p, hasHandbook: e.target.checked }))}
                className="w-4 h-4 rounded border-pink-soft text-rose-brown focus:ring-pink-muted"
              />
              <span className="text-sm text-dark-brown">手帳あり</span>
            </label>
            {diagForm.hasHandbook && (
              <input
                type="text"
                value={diagForm.handbookName}
                onChange={(e) => setDiagForm((p) => ({ ...p, handbookName: e.target.value }))}
                placeholder="手帳名（例：療育手帳・精神障害者保健福祉手帳）"
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-white text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            )}
            <button
              onClick={handleSaveDiag}
              className="w-full flex items-center justify-center gap-2 bg-pink-muted text-cream py-2 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity"
            >
              <Save size={14} />
              {diagSaved ? '保存しました！' : '診断情報を保存'}
            </button>
          </div>
        </div>

        {/* ── 福祉サービス事業者 ── */}
        <div>
          <p className="text-xs font-semibold text-dark-brown mb-2">福祉サービス事業者</p>
          {welfareProviders.length > 0 && (
            <div className="space-y-2 mb-2">
              {welfareProviders.map((wp) => (
                <div key={wp.id} className="bg-white rounded-xl px-4 py-3 border border-pink-soft/60 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-brown truncate">{wp.name}</p>
                    {wp.phone && (
                      <a href={`tel:${wp.phone}`} className="flex items-center gap-1 text-xs text-rose-brown/70 hover:underline">
                        <Phone size={11} />{wp.phone}
                      </a>
                    )}
                  </div>
                  <button onClick={() => onDeleteProvider(wp.id)} className="text-rose-brown/40 hover:text-rose-brown transition-colors">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showProviderForm ? (
            <div className="bg-white rounded-xl p-3 border border-pink-soft/60 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-dark-brown">事業者を追加</p>
                <button onClick={() => { setShowProviderForm(false); setProviderError('') }} className="text-rose-brown/50 hover:text-rose-brown"><X size={14} /></button>
              </div>
              <input
                type="text"
                value={providerForm.name}
                onChange={(e) => { setProviderForm((p) => ({ ...p, name: e.target.value })); if (providerError) setProviderError('') }}
                placeholder="事業者名 *"
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
              {providerError && <p className="text-red-400 text-xs">{providerError}</p>}
              <input
                type="tel"
                value={providerForm.phone}
                onChange={(e) => setProviderForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="電話番号（任意）"
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
              <div className="flex gap-2">
                <button onClick={() => { setShowProviderForm(false); setProviderError('') }} className="flex-1 py-1.5 rounded-lg border border-pink-soft text-rose-brown text-xs hover:bg-pink-soft/30 transition-colors">キャンセル</button>
                <button onClick={handleAddProvider} className="flex-1 py-1.5 rounded-lg bg-pink-muted text-cream text-xs font-medium hover:opacity-90 transition-opacity">追加する</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowProviderForm(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-pink-muted/60 text-sm text-rose-brown hover:bg-pink-soft/30 transition-colors"
            >
              <Plus size={14} />事業者を追加
            </button>
          )}
        </div>

        {/* ── 相談支援専門員 ── */}
        <div>
          <p className="text-xs font-semibold text-dark-brown mb-2">相談支援専門員</p>
          {welfareConsultants.length > 0 && (
            <div className="space-y-2 mb-2">
              {welfareConsultants.map((wc) => (
                <div key={wc.id} className="bg-white rounded-xl px-4 py-3 border border-pink-soft/60 flex items-start gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-dark-brown">{wc.name}</p>
                    {wc.office && <p className="text-xs text-dark-brown/60">{wc.office}</p>}
                    {wc.phone && (
                      <a href={`tel:${wc.phone}`} className="flex items-center gap-1 text-xs text-rose-brown/70 hover:underline">
                        <Phone size={11} />{wc.phone}
                      </a>
                    )}
                  </div>
                  <button onClick={() => onDeleteConsultant(wc.id)} className="text-rose-brown/40 hover:text-rose-brown transition-colors mt-0.5">
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {showConsultantForm ? (
            <div className="bg-white rounded-xl p-3 border border-pink-soft/60 space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium text-dark-brown">相談支援専門員を追加</p>
                <button onClick={() => { setShowConsultantForm(false); setConsultantError('') }} className="text-rose-brown/50 hover:text-rose-brown"><X size={14} /></button>
              </div>
              <input
                type="text"
                value={consultantForm.name}
                onChange={(e) => { setConsultantForm((p) => ({ ...p, name: e.target.value })); if (consultantError) setConsultantError('') }}
                placeholder="名前 *"
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
              {consultantError && <p className="text-red-400 text-xs">{consultantError}</p>}
              <input
                type="text"
                value={consultantForm.office}
                onChange={(e) => setConsultantForm((p) => ({ ...p, office: e.target.value }))}
                placeholder="事業所名（任意）"
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
              <input
                type="tel"
                value={consultantForm.phone}
                onChange={(e) => setConsultantForm((p) => ({ ...p, phone: e.target.value }))}
                placeholder="電話番号（任意）"
                className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
              <div className="flex gap-2">
                <button onClick={() => { setShowConsultantForm(false); setConsultantError('') }} className="flex-1 py-1.5 rounded-lg border border-pink-soft text-rose-brown text-xs hover:bg-pink-soft/30 transition-colors">キャンセル</button>
                <button onClick={handleAddConsultant} className="flex-1 py-1.5 rounded-lg bg-pink-muted text-cream text-xs font-medium hover:opacity-90 transition-opacity">追加する</button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowConsultantForm(true)}
              className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-dashed border-pink-muted/60 text-sm text-rose-brown hover:bg-pink-soft/30 transition-colors"
            >
              <Plus size={14} />相談支援専門員を追加
            </button>
          )}
        </div>

      </div>
    </Accordion>
  )
}

export default WelfareSection
