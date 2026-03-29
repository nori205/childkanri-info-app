// ===========================
// タスク追加モーダルコンポーネント
// ===========================

import { useState } from 'react'
import { X } from 'lucide-react'
import type { TaskFormValues, TaskCategory } from '../types'
import { TASK_CATEGORIES } from '../constants'

interface AddTaskModalProps {
  childName: string
  onClose: () => void
  onAdd: (values: TaskFormValues) => void
}

const initialValues: TaskFormValues = {
  title: '',
  category: ['書類提出'],  // 配列に変更（複数選択対応）
  dueDate: '',
  memo: '',
  amount: '',
}

const AddTaskModal = ({ childName, onClose, onAdd }: AddTaskModalProps) => {
  const [values, setValues] = useState<TaskFormValues>(initialValues)
  const [titleError, setTitleError] = useState('')

  // 入力変更ハンドラ
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target
    setValues((prev) => ({ ...prev, [name]: value }))
    if (name === 'title' && titleError) setTitleError('')
  }

  // 送信ハンドラ
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!values.title.trim()) {
      setTitleError('タイトルを入力してください')
      return
    }
    onAdd(values)
    onClose()
  }

  // カテゴリのトグル（複数選択）
  const toggleCategory = (cat: TaskCategory) => {
    setValues((prev) => ({
      ...prev,
      category: prev.category.includes(cat)
        ? prev.category.filter((c) => c !== cat)
        : [...prev.category, cat],
    }))
  }

  // 支払い・入金が選択されているか
  const isPayment = values.category.includes('支払い・入金')

  return (
    <div
      className="fixed inset-0 bg-dark-brown/40 flex items-end sm:items-center justify-center z-50"
      onClick={(e) => e.target === e.currentTarget && onClose()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      {/* モーダル本体（スマホはボトムシート風） */}
      <div className="bg-cream rounded-t-2xl sm:rounded-2xl shadow-xl w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* ヘッダー */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-lg font-bold text-rose-brown">タスクを追加</h2>
              <p className="text-xs text-rose-brown/70">{childName}</p>
            </div>
            <button
              onClick={onClose}
              className="text-rose-brown hover:opacity-70 transition-opacity"
              aria-label="閉じる"
            >
              <X size={22} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* タイトル */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">
                タイトル <span className="text-pink-muted">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={values.title}
                onChange={handleChange}
                placeholder="例：遠足の持ち物を準備する"
                className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
              {titleError && (
                <p className="text-red-400 text-xs mt-1">{titleError}</p>
              )}
            </div>

            {/* 種類 */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">
                種類
              </label>
              <div className="flex flex-wrap gap-2">
                {TASK_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                      values.category.includes(cat)
                        ? 'bg-pink-muted text-cream border-pink-muted'
                        : 'bg-white text-rose-brown border-pink-soft hover:bg-pink-soft/40'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* 金額（支払い・入金のときのみ） */}
            {isPayment && (
              <div>
                <label className="block text-sm font-medium text-dark-brown mb-1">
                  金額（円）
                </label>
                <input
                  type="number"
                  name="amount"
                  value={values.amount}
                  onChange={handleChange}
                  placeholder="例：3500"
                  min="0"
                  className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted"
                />
              </div>
            )}

            {/* 期限日 */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">
                期限日（任意）
              </label>
              <input
                type="date"
                name="dueDate"
                value={values.dueDate}
                onChange={handleChange}
                className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown focus:outline-none focus:ring-2 focus:ring-pink-muted"
              />
            </div>

            {/* メモ */}
            <div>
              <label className="block text-sm font-medium text-dark-brown mb-1">
                メモ（任意）
              </label>
              <textarea
                name="memo"
                value={values.memo}
                onChange={handleChange}
                placeholder="補足情報を入力..."
                rows={2}
                className="w-full border border-pink-soft rounded-xl px-3 py-2 bg-white text-dark-brown placeholder-rose-brown/40 focus:outline-none focus:ring-2 focus:ring-pink-muted resize-none"
              />
            </div>

            {/* ボタン */}
            <div className="flex gap-3 pt-1">
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
    </div>
  )
}

export default AddTaskModal
