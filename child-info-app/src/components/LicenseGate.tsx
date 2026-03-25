// ===========================
// ライセンスゲート関連コンポーネント
//
// エクスポート:
//   default  LicenseGate      - ロックセクションのラッパー
//   named    LicenseBanner    - ページ上部の常時表示バナー
//   named    UnlockModal      - 解除コード入力モーダル
//   named    ChildLimitModal  - 子供追加制限の案内モーダル
// ===========================

import { useState } from 'react'
import { Lock, Unlock, X, KeyRound, CheckCircle2, Users } from 'lucide-react'

// ── LicenseBanner ─────────────────────────────────────────
// ページ最上部に常時表示するバナー

interface LicenseBannerProps {
  isUnlocked: boolean
  onUnlockClick: () => void
}

export const LicenseBanner = ({ isUnlocked, onUnlockClick }: LicenseBannerProps) => {
  if (isUnlocked) {
    // 解除済み：控えめなグリーンバナー
    return (
      <div className="bg-green-50 border-b border-green-200">
        <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-center gap-2">
          <CheckCircle2 size={15} className="text-green-600 flex-shrink-0" />
          <p className="text-sm text-green-700 font-medium">有料版をご利用中</p>
        </div>
      </div>
    )
  }

  // 未解除：目立つ解除促進バナー
  return (
    <div className="bg-rose-brown">
      <div className="max-w-2xl mx-auto px-4 py-2.5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <Lock size={15} className="text-cream flex-shrink-0" />
          <p className="text-sm text-cream/90 truncate">
            健康情報・ワクチン記録などが使えます
          </p>
        </div>
        <button
          onClick={onUnlockClick}
          className="flex-shrink-0 flex items-center gap-1.5 bg-cream text-rose-brown text-xs font-bold px-3 py-1.5 rounded-full hover:opacity-90 active:opacity-80 transition-opacity shadow-sm"
        >
          <Unlock size={13} />
          全機能を解除する
        </button>
      </div>
    </div>
  )
}

// ── UnlockModal ───────────────────────────────────────────
// 解除コード入力モーダル

interface UnlockModalProps {
  onClose: () => void
  // コードを受け取り、成功/失敗を返す
  onUnlock: (code: string) => boolean
}

export const UnlockModal = ({ onClose, onUnlock }: UnlockModalProps) => {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!code.trim()) {
      setError('コードを入力してください')
      return
    }
    const ok = onUnlock(code)
    if (ok) {
      setSuccess(true)
      // 1.5秒後に自動で閉じる
      setTimeout(onClose, 1500)
    } else {
      setError('コードが正しくありません')
    }
  }

  return (
    <div
      className="fixed inset-0 bg-dark-brown/40 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cream rounded-2xl shadow-xl w-full max-w-sm p-6">
        {success ? (
          // 解除成功メッセージ
          <div className="flex flex-col items-center gap-3 py-4">
            <CheckCircle2 size={44} className="text-green-500" />
            <p className="text-lg font-bold text-dark-brown">解除しました！</p>
            <p className="text-sm text-rose-brown/70">全機能がご利用いただけます</p>
          </div>
        ) : (
          <>
            {/* ヘッダー */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <KeyRound size={20} className="text-rose-brown" />
                <h2 className="text-lg font-bold text-rose-brown">解除コードを入力</h2>
              </div>
              <button
                onClick={onClose}
                className="text-rose-brown/50 hover:text-rose-brown transition-colors"
                aria-label="閉じる"
              >
                <X size={20} />
              </button>
            </div>

            {/* 説明 */}
            <p className="text-sm text-dark-brown/70 mb-5">
              解除コードを入力すると、健康・医療情報・ワクチン記録・提出用サマリー・
              複数人登録などすべての機能が使えるようになります。
            </p>

            {/* 入力フォーム */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => {
                    setCode(e.target.value)
                    setError('')
                  }}
                  placeholder="解除コードを入力"
                  autoFocus
                  className="w-full border border-pink-soft rounded-xl px-4 py-3 bg-white text-dark-brown text-center font-mono tracking-widest text-lg placeholder-rose-brown/30 focus:outline-none focus:ring-2 focus:ring-pink-muted"
                />
                {error && (
                  <p className="text-red-400 text-xs mt-1.5 text-center">{error}</p>
                )}
              </div>

              <div className="flex gap-3">
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
                  解除する
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

// ── ChildLimitModal ───────────────────────────────────────
// 子供2人目追加時に表示する制限案内モーダル

interface ChildLimitModalProps {
  onClose: () => void
  onUnlockClick: () => void
}

export const ChildLimitModal = ({ onClose, onUnlockClick }: ChildLimitModalProps) => {
  const handleUnlock = () => {
    onClose()
    onUnlockClick()
  }

  return (
    <div
      className="fixed inset-0 bg-dark-brown/40 flex items-center justify-center z-50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-cream rounded-2xl shadow-xl w-full max-w-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Users size={20} className="text-rose-brown" />
            <h2 className="text-lg font-bold text-rose-brown">子供2人目以降は有料版</h2>
          </div>
          <button
            onClick={onClose}
            className="text-rose-brown/50 hover:text-rose-brown transition-colors"
            aria-label="閉じる"
          >
            <X size={20} />
          </button>
        </div>

        <div className="bg-pink-soft/50 rounded-xl p-4 mb-5 text-center">
          <Lock size={28} className="text-rose-brown/60 mx-auto mb-2" />
          <p className="text-sm font-medium text-dark-brown mb-1">
            デモ版では1人まで登録できます
          </p>
          <p className="text-xs text-dark-brown/60">
            有料版では何人でも登録できます
          </p>
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 border border-pink-soft text-rose-brown py-2.5 rounded-xl font-medium hover:bg-pink-soft/30 transition-colors text-sm"
          >
            閉じる
          </button>
          <button
            onClick={handleUnlock}
            className="flex-1 bg-pink-muted text-cream py-2.5 rounded-xl font-medium shadow hover:opacity-90 transition-opacity text-sm"
          >
            コードで解除する
          </button>
        </div>
      </div>
    </div>
  )
}

// ── LicenseGate (default) ─────────────────────────────────
// ロック対象セクションをラップするコンポーネント
// isUnlocked=true のとき：children をそのまま描画
// isUnlocked=false のとき：ロックカードを表示（childrenは非描画）

interface LicenseGateProps {
  isUnlocked: boolean
  onUnlockClick: () => void
  // ロックカードに表示するセクション名
  featureName: string
  // ロックカードのサブテキスト（省略可）
  featureDescription?: string
  children: React.ReactNode
}

const LicenseGate = ({
  isUnlocked,
  onUnlockClick,
  featureName,
  featureDescription = 'この機能は有料版でご利用いただけます',
  children,
}: LicenseGateProps) => {
  // 解除済みのときはそのまま描画
  if (isUnlocked) return <>{children}</>

  // 未解除：ロックカードを表示
  return (
    <div className="bg-pink-soft/40 border border-dashed border-pink-muted/50 rounded-2xl px-6 py-8 flex flex-col items-center gap-3 text-center">
      <div className="w-12 h-12 bg-pink-soft rounded-full flex items-center justify-center">
        <Lock size={22} className="text-rose-brown" />
      </div>
      <div>
        <p className="text-sm font-semibold text-dark-brown mb-1">{featureName}</p>
        <p className="text-xs text-dark-brown/55">{featureDescription}</p>
      </div>
      <button
        onClick={onUnlockClick}
        className="flex items-center gap-1.5 bg-pink-muted text-cream text-sm font-medium px-5 py-2 rounded-full shadow hover:opacity-90 active:opacity-80 transition-opacity mt-1"
      >
        <Unlock size={14} />
        コードを入力して解除する
      </button>
    </div>
  )
}

export default LicenseGate
