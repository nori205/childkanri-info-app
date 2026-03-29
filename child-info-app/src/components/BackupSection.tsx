// ===========================
// バックアップ・復元セクション（上部固定）
// ===========================

import { useRef, useState, useEffect } from 'react'
import { Download, Upload, Share2, X } from 'lucide-react'
import { STORAGE_KEY } from '../constants'

// JSON文字列を圧縮してbase64エンコード（deflate-raw + Unicode対応）
const encodeData = async (json: string): Promise<string> => {
  const bytes = new TextEncoder().encode(json)
  const cs = new CompressionStream('deflate-raw')
  const writer = cs.writable.getWriter()
  writer.write(bytes)
  writer.close()
  const compressed = await new Response(cs.readable).arrayBuffer()
  const compressedBytes = new Uint8Array(compressed)
  const binStr = Array.from(compressedBytes, (b) => String.fromCharCode(b)).join('')
  return btoa(binStr)
}

const BACKUP_LAST_KEY = 'child-info-app-last-backup'
const BACKUP_REMIND_DAYS = 7

const BackupSection = () => {
  const importRef = useRef<HTMLInputElement>(null)
  const [msg, setMsg] = useState('')
  const [showReminder, setShowReminder] = useState(false)
  const [showShareGuide, setShowShareGuide] = useState(false)

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

  const handleShare = async () => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (!data) {
      setMsg('保存データがありません')
      setTimeout(() => setMsg(''), 3000)
      return
    }
    const encoded = await encodeData(data)
    const url = `${window.location.origin}${window.location.pathname}?import=${encodeURIComponent(encoded)}`
    if (navigator.share) {
      try {
        await navigator.share({ title: 'こどめも データ共有', text: url })
        setShowShareGuide(true)
      } catch {
        // キャンセルは無視
      }
    } else {
      await navigator.clipboard.writeText(url)
      setMsg('URLをコピーしました！')
      setShowShareGuide(true)
      setTimeout(() => setMsg(''), 3000)
    }
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
    <div className="bg-white border border-pink-soft/60 rounded-xl px-3 py-2">
      <div className="flex items-center gap-2">
        <span className="text-xs text-rose-brown/70 flex-1 leading-tight">
          {showReminder
            ? '⚠️ バックアップをおすすめします'
            : '💾 データのバックアップ・復元'}
        </span>
        <button
          onClick={handleShare}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border border-blue-300 bg-white text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Share2 size={12} />
          URLで共有
        </button>
        <button
          onClick={handleExport}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border border-pink-soft bg-white text-rose-brown hover:bg-pink-soft/30 transition-colors"
        >
          <Download size={12} />
          バックアップ
        </button>
        <button
          onClick={() => importRef.current?.click()}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs border border-pink-soft bg-white text-rose-brown hover:bg-pink-soft/30 transition-colors"
        >
          <Upload size={12} />
          復元
        </button>
        <input ref={importRef} type="file" accept=".json" onChange={handleImport} className="hidden" />
      </div>
      {msg && <p className="text-xs text-center text-rose-brown mt-1">{msg}</p>}

      {/* 共有後の受け取り方ガイド */}
      {showShareGuide && (
        <div className="mt-2 bg-blue-50 border border-blue-200 rounded-lg px-3 py-2.5 relative">
          <button
            onClick={() => setShowShareGuide(false)}
            className="absolute top-2 right-2 text-blue-300 hover:text-blue-500"
          >
            <X size={14} />
          </button>
          <p className="text-xs font-semibold text-blue-700 mb-1.5">受け取った人の手順</p>
          <ol className="text-xs text-blue-700 space-y-1 leading-relaxed list-none">
            <li>① LINEに届いたURLをタップする</li>
            <li>② 画面上部の「…」→「ブラウザで開く」をタップ</li>
            <li className="text-blue-500 text-[10px] pl-3">※ LINEの中のブラウザではなく、ChromeやSafariで開く必要があります</li>
            <li>③「データを取り込みますか？」→「OK」を押す</li>
            <li>④ アプリにデータが反映されて完了！</li>
          </ol>
          <p className="text-[10px] text-blue-400 mt-2">
            機種変更のときも同じ手順でデータを引き継げます
          </p>
        </div>
      )}
    </div>
  )
}

export default BackupSection
