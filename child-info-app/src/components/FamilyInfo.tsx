// ===========================
// 家族共通情報コンポーネント（複数メンバー対応）
// ===========================

import { useState } from 'react'
import { Users, Phone, MapPin, ChevronDown, ChevronUp, Save, Plus, Trash2, X } from 'lucide-react'
import type { FamilyInfo as FamilyInfoType, FamilyMember } from '../types'

interface FamilyInfoProps {
  familyInfo: FamilyInfoType
  onSave: (values: Omit<FamilyInfoType, 'updatedAt'>) => void
}

// 続柄の候補リスト
const RELATIONSHIP_OPTIONS = ['父', '母', '祖父', '祖母', '兄', '姉', '弟', '妹', 'その他']

// 新規メンバーフォームの初期値
const emptyMemberForm = () => ({ name: '', relationship: '保護者', phone: '', isEmergency: false })

const FamilyInfo = ({ familyInfo, onSave }: FamilyInfoProps) => {
  // セクションの折りたたみ状態（セッション中は維持）
  const [isOpen, setIsOpen] = useState(() => {
    return sessionStorage.getItem('familyInfo-open') === 'true'
  })

  // メンバー一覧（ローカル編集用）
  const [members, setMembers] = useState<FamilyMember[]>(familyInfo.members)
  // 住所
  const [address, setAddress] = useState(familyInfo.address)
  // 住所の保存メッセージ
  const [saved, setSaved] = useState(false)
  // 新規メンバー追加フォームの表示
  const [showAddForm, setShowAddForm] = useState(false)
  // 新規メンバーフォームの入力値
  const [memberForm, setMemberForm] = useState(emptyMemberForm)
  // バリデーションエラー
  const [memberError, setMemberError] = useState('')

  // メンバーを追加して即時保存
  const handleAddMember = () => {
    if (!memberForm.name.trim()) {
      setMemberError('名前を入力してください')
      return
    }
    const newMember: FamilyMember = {
      id: crypto.randomUUID(),
      name: memberForm.name.trim(),
      relationship: memberForm.relationship.trim() || 'その他',
      phone: memberForm.phone.trim(),
      isEmergency: memberForm.isEmergency,
    }
    const updated = [...members, newMember]
    setMembers(updated)
    onSave({ members: updated, address })
    setMemberForm(emptyMemberForm())
    setShowAddForm(false)
    setMemberError('')
  }

  // メンバーを削除して即時保存
  const handleDeleteMember = (id: string) => {
    const updated = members.filter((m) => m.id !== id)
    setMembers(updated)
    onSave({ members: updated, address })
  }

  // 住所を保存
  const handleSaveAddress = () => {
    onSave({ members, address })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // ヘッダーに表示するメンバー名（最大3人）
  const memberNames = members.slice(0, 3).map((m) => m.name).join('・')
  const hasMoreMembers = members.length > 3

  return (
    <div className="bg-pink-soft rounded-2xl shadow-sm overflow-hidden">
      {/* セクションヘッダー（折りたたみ切り替え） */}
      <button
        onClick={() => setIsOpen((v) => {
          const next = !v
          sessionStorage.setItem('familyInfo-open', String(next))
          return next
        })}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2 text-dark-brown font-semibold">
            <Users size={18} className="text-rose-brown" />
            <span>家族の共通情報</span>
            {members.length > 0 && (
              <span className="text-xs bg-rose-brown/20 text-rose-brown px-2 py-0.5 rounded-full">
                {members.length}人
              </span>
            )}
          </div>
          {/* 折りたたみ時にメンバー名を表示 */}
          {!isOpen && members.length > 0 && (
            <p className="text-xs text-dark-brown/60 pl-6">
              {memberNames}{hasMoreMembers ? '…' : ''}
            </p>
          )}
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-rose-brown flex-shrink-0" />
        ) : (
          <ChevronDown size={18} className="text-rose-brown flex-shrink-0" />
        )}
      </button>

      {/* フォーム本体 */}
      {isOpen && (
        <div className="px-5 pb-5 space-y-5">

          {/* ── 家族メンバー ── */}
          <div>
            <p className="text-sm font-semibold text-dark-brown mb-3 flex items-center gap-1.5">
              <Users size={14} className="text-rose-brown" />
              家族メンバー
            </p>

            {/* メンバー一覧 */}
            {members.length > 0 && (
              <div className="space-y-2 mb-3">
                {members.map((m) => (
                  <div
                    key={m.id}
                    className="bg-white rounded-xl px-4 py-3 border border-pink-soft/60 flex items-center gap-3"
                  >
                    {/* 続柄バッジ */}
                    <span className="text-xs bg-cream text-rose-brown px-2 py-0.5 rounded-md border border-pink-soft flex-shrink-0">
                      {m.relationship}
                    </span>
                    {/* 名前 */}
                    <span className="text-sm font-medium text-dark-brown flex-1 min-w-0 truncate">
                      {m.name}
                    </span>
                    {/* 緊急連絡先バッジ */}
                    {m.isEmergency && (
                      <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-md flex-shrink-0">
                        緊急
                      </span>
                    )}
                    {/* 電話番号 */}
                    {m.phone && (
                      <span className="flex items-center gap-1 text-xs text-rose-brown/70 flex-shrink-0">
                        <Phone size={11} />
                        <a href={`tel:${m.phone}`} className="hover:underline">{m.phone}</a>
                      </span>
                    )}
                    {/* 削除ボタン */}
                    <button
                      onClick={() => handleDeleteMember(m.id)}
                      className="text-rose-brown/40 hover:text-rose-brown transition-colors flex-shrink-0"
                      aria-label="削除"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* メンバー追加フォーム */}
            {showAddForm ? (
              <div className="bg-white rounded-xl p-4 border border-pink-soft/60 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-dark-brown">メンバーを追加</p>
                  <button
                    onClick={() => { setShowAddForm(false); setMemberError('') }}
                    className="text-rose-brown/50 hover:text-rose-brown"
                  >
                    <X size={16} />
                  </button>
                </div>

                {/* 名前（必須） */}
                <div>
                  <input
                    type="text"
                    value={memberForm.name}
                    onChange={(e) => {
                      setMemberForm((p) => ({ ...p, name: e.target.value }))
                      if (memberError) setMemberError('')
                    }}
                    placeholder="名前 *（例：山田 太郎）"
                    className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
                  />
                  {memberError && <p className="text-red-400 text-xs mt-1">{memberError}</p>}
                </div>

                {/* 続柄 */}
                <div>
                  <p className="text-xs text-rose-brown mb-1.5">続柄</p>
                  <div className="flex flex-wrap gap-1.5">
                    {RELATIONSHIP_OPTIONS.map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setMemberForm((p) => ({ ...p, relationship: rel }))}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                          memberForm.relationship === rel
                            ? 'bg-rose-brown text-cream border-rose-brown'
                            : 'border-pink-soft text-rose-brown/70 hover:bg-pink-soft/40'
                        }`}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                  {/* 自由入力も可 */}
                  <input
                    type="text"
                    value={memberForm.relationship}
                    onChange={(e) => setMemberForm((p) => ({ ...p, relationship: e.target.value }))}
                    placeholder="または自由入力"
                    className="mt-2 w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
                  />
                </div>

                {/* 電話番号（任意） */}
                <input
                  type="tel"
                  value={memberForm.phone}
                  onChange={(e) => setMemberForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="電話番号（任意）"
                  className="w-full border border-pink-soft rounded-lg px-3 py-2 bg-cream text-dark-brown text-sm placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
                />

                {/* 緊急連絡先チェックボックス */}
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={memberForm.isEmergency}
                    onChange={(e) => setMemberForm((p) => ({ ...p, isEmergency: e.target.checked }))}
                    className="w-4 h-4 rounded border-pink-soft text-rose-brown focus:ring-pink-muted"
                  />
                  <span className="text-sm text-dark-brown">緊急連絡先にする</span>
                  <span className="text-xs bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-md">緊急</span>
                </label>

                <div className="flex gap-2">
                  <button
                    onClick={() => { setShowAddForm(false); setMemberError('') }}
                    className="flex-1 py-2 rounded-lg border border-pink-soft text-rose-brown text-sm hover:bg-pink-soft/30 transition-colors"
                  >
                    キャンセル
                  </button>
                  <button
                    onClick={handleAddMember}
                    className="flex-1 py-2 rounded-lg bg-pink-muted text-cream text-sm font-medium hover:opacity-90 transition-opacity"
                  >
                    追加する
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddForm(true)}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-dashed border-pink-muted/60 text-sm text-rose-brown hover:bg-pink-soft/30 transition-colors"
              >
                <Plus size={15} />
                メンバーを追加
              </button>
            )}
          </div>

          {/* ── 住所 ── */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-dark-brown mb-1">
              <MapPin size={14} className="text-rose-brown" />
              住所
            </label>
            <input
              type="text"
              value={address}
              onChange={(e) => { setAddress(e.target.value); setSaved(false) }}
              placeholder="例：東京都渋谷区..."
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSaveAddress}
            className="w-full flex items-center justify-center gap-2 bg-pink-muted text-cream py-2.5 rounded-xl font-medium shadow hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <Save size={16} />
            {saved ? '保存しました！' : '住所を保存する'}
          </button>
        </div>
      )}
    </div>
  )
}

export default FamilyInfo
