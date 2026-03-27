// ===========================
// 子供追加モーダルコンポーネント
// ===========================

import { useState } from 'react'
import { X } from 'lucide-react'
import type { ChildFormValues } from '../types'
import { BLOOD_TYPES, GRADE_TYPES } from '../constants'

interface AddChildModalProps {
  onClose: () => void
  onAdd: (values: ChildFormValues) => void
}

// フォームの初期値
const initialValues: ChildFormValues = {
  name: '',
  birthDate: '',
  grade: '未就学',
  schoolName: '',
  bloodType: '不明',
  height: '',
  weight: '',
}

const AddChildModal = ({ onClose, onAdd }: AddChildModalProps) => {
  const [values, setValues] = useState<ChildFormValues>(initialValues)
  const [errors, setErrors] = useState<Partial<Record<keyof ChildFormValues, string>>>({})

  // 入力値の変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    // エラーをクリア
    if (errors[name as keyof ChildFormValues]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  // バリデーション
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ChildFormValues, string>> = {}
    if (!values.name.trim()) newErrors.name = '名前を入力してください'
    if (!values.birthDate) newErrors.birthDate = '生年月日を入力してください'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    onAdd(values)
    onClose()
  }

  return (
    // オーバーレイ
    <div
      className="fixed inset-0 bg-dark-brown/40 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cream rounded-2xl shadow-xl w-full max-w-md p-6">
        {/* ヘッダー */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-bold text-rose-brown">子供を追加</h2>
          <button
            onClick={onClose}
            className="text-rose-brown hover:opacity-70 transition-opacity"
            aria-label="閉じる"
          >
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 名前 */}
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">
              名前 <span className="text-pink-muted">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={values.name}
              onChange={handleChange}
              placeholder="例：山田 たろう"
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
            {errors.name && (
              <p className="text-red-400 text-xs mt-1">{errors.name}</p>
            )}
          </div>

          {/* 生年月日 */}
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">
              生年月日 <span className="text-pink-muted">*</span>
            </label>
            <input
              type="date"
              name="birthDate"
              value={values.birthDate}
              onChange={handleChange}
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
            {errors.birthDate && (
              <p className="text-red-400 text-xs mt-1">{errors.birthDate}</p>
            )}
          </div>

          {/* 学年 */}
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">
              学年
            </label>
            <select
              name="grade"
              value={values.grade}
              onChange={handleChange}
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-pink-muted"
            >
              {GRADE_TYPES.map((grade) => (
                <option key={grade} value={grade}>
                  {grade}
                </option>
              ))}
            </select>
          </div>

          {/* 学校・園名 */}
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">
              学校・園名
            </label>
            <input
              type="text"
              name="schoolName"
              value={values.schoolName}
              onChange={handleChange}
              placeholder="例：○○小学校"
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
            />
          </div>

          {/* 血液型 */}
          <div>
            <label className="block text-sm font-medium text-dark-brown mb-1">
              血液型
            </label>
            <select
              name="bloodType"
              value={values.bloodType}
              onChange={handleChange}
              className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-pink-muted"
            >
              {BLOOD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}型
                </option>
              ))}
            </select>
          </div>

          {/* 身長・体重 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">身長（cm）</label>
              <input
                type="number"
                name="height"
                value={values.height}
                onChange={handleChange}
                placeholder="例：110"
                className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">体重（kg）</label>
              <input
                type="number"
                name="weight"
                value={values.weight}
                onChange={handleChange}
                placeholder="例：18.5"
                className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            </div>
          </div>

          {/* ボタン */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-pink-soft text-rose-brown py-2.5 rounded-xl font-medium hover:bg-pink-soft/30 transition-colors"
            >
              キャンセル
            </button>
            <button
              type="submit"
              className="flex-1 bg-pink-muted text-cream py-2.5 rounded-xl font-medium shadow hover:opacity-90 active:opacity-80 transition-opacity"
            >
              追加する
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddChildModal
