// ===========================
// 家族共通情報コンポーネント
// ===========================

import { useState } from 'react'
import { Users, Phone, MapPin, ChevronDown, ChevronUp, Save } from 'lucide-react'
import type { FamilyInfo as FamilyInfoType } from '../types'

interface FamilyInfoProps {
  familyInfo: FamilyInfoType
  onSave: (values: Omit<FamilyInfoType, 'updatedAt'>) => void
}

const FamilyInfo = ({ familyInfo, onSave }: FamilyInfoProps) => {
  // セクションの折りたたみ状態
  const [isOpen, setIsOpen] = useState(false)
  const [values, setValues] = useState({
    parentName: familyInfo.parentName,
    emergencyContact: familyInfo.emergencyContact,
    address: familyInfo.address,
  })
  const [saved, setSaved] = useState(false)

  // 入力値の変更ハンドラ
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    setSaved(false)
  }

  // 保存ハンドラ
  const handleSave = () => {
    onSave(values)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="bg-pink-soft rounded-2xl shadow-sm overflow-hidden">
      {/* セクションヘッダー（折りたたみ切り替え） */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="w-full flex items-center justify-between px-5 py-4 text-left"
      >
        <div className="flex items-center gap-2 text-dark-brown font-semibold">
          <Users size={18} className="text-rose-brown" />
          <span>家族の共通情報</span>
        </div>
        {isOpen ? (
          <ChevronUp size={18} className="text-rose-brown" />
        ) : (
          <ChevronDown size={18} className="text-rose-brown" />
        )}
      </button>

      {/* フォーム本体 */}
      {isOpen && (
        <div className="px-5 pb-5 space-y-4">
          {/* 保護者名 */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-dark-brown mb-1">
              <Users size={14} className="text-rose-brown" />
              保護者名
            </label>
            <input
              type="text"
              name="parentName"
              value={values.parentName}
              onChange={handleChange}
              placeholder="例：山田 花子"
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
          </div>

          {/* 緊急連絡先 */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-dark-brown mb-1">
              <Phone size={14} className="text-rose-brown" />
              緊急連絡先
            </label>
            <input
              type="tel"
              name="emergencyContact"
              value={values.emergencyContact}
              onChange={handleChange}
              placeholder="例：090-0000-0000"
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
          </div>

          {/* 住所 */}
          <div>
            <label className="flex items-center gap-1.5 text-sm font-medium text-dark-brown mb-1">
              <MapPin size={14} className="text-rose-brown" />
              住所
            </label>
            <input
              type="text"
              name="address"
              value={values.address}
              onChange={handleChange}
              placeholder="例：東京都渋谷区..."
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
          </div>

          {/* 保存ボタン */}
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center gap-2 bg-pink-muted text-cream py-2.5 rounded-xl font-medium shadow hover:opacity-90 active:opacity-80 transition-opacity"
          >
            <Save size={16} />
            {saved ? '保存しました！' : '保存する'}
          </button>
        </div>
      )}
    </div>
  )
}

export default FamilyInfo
