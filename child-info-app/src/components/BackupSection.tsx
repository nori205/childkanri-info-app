// ===========================
// バックアップ・復元セクション（上部固定）
// ===========================

import { useRef, useState, useEffect } from 'react'
import { Download, Upload } from 'lucide-react'
import { STORAGE_KEY } from '../constants'

const BACKUP_LAST_KEY = 'child-info-app-last-backup'
const BACKUP_REMIND_DAYS = 7

const BackupSection = () => {
  const importRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [showReminder, setShowReminder] = useState(false)

  useEffect(() => {
    const last = localStorage.getItem(BACKUP_LAST_KEY)
    if (!last) {
      if (localStorage.getItem(STORAGE_KEY)) setShowReminder(true)
      return
    }
    const daysSince = (Date.now() - Number(last)) / (1000 * 60 * 60 * 24)
    if (daysSince >= BACKUP_REMIND_DAYS) setShowReminder(true)
  }, [])

  const handleExport = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      setMsg('保存データがありません')
      setTimeout(() => setMsg(''), 3000)
      return
    }
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.target = '_blank'
    const date = new Date().toISOString().slice(0, 10)
    a.download = `kodomemo-backup-${date}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    localStorage.setItem(BACKUP_LAST_KEY, String(Date.now()))
    setMsg('バックアップしました！')
    setShowReminder(false)
    setTimeout(() => setMsg(''), 3000)
  }

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target?.result as string
        JSON.parse(text)
        if (window.confirm('現在のデータをすべて置き換えますか？\nこの操作は元に戻せません。')) {
          localStorage.setItem(STORAGE_KEY, text)
          window.location.reload()
        }
      } catch {
        alert('ファイルが正しくありません。\nこどめものバックアップファイルを選んでください。')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  return (
    <div className="bg-white border border-pink-soft/60 rounded-2xl px-4 py-3">
      <p className="text-xs font-semibold text-dark-brown mb-0.5">データのバックアップ・復元</p>
      {showReminder && (
        <p className="text-xs text-amber-600 mb-2">💾 しばらくバックアップしていません。定期的に保存しましょう</p>
      )}
      <div className="flex gap-2 mt-2">
        <button
          onClick={handleExport}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-pink-soft bg-white text-rose-brown hover:bg-pink-soft/30 transition-colors"
        >
          <Download size={14} />
          バックアップ
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-sm font-medium border border-pink-soft bg-white text-rose-brown hover:bg-pink-soft/30 transition-colors"
        >
          <Upload size={14} />
          復元する
        </button>
        <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>
      {msg && <p className="text-xs text-center text-rose-brown mt-2">{msg}</p>}
    </div>
  )
}

export default BackupSection
