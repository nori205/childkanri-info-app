// ===========================
// ライセンス管理カスタムフック
// ===========================

import { useState } from 'react'
import { LICENSE_CODE, LICENSE_STORAGE_KEY } from '../constants'

interface UseLicenseReturn {
  // 解除済みかどうか
  isUnlocked: boolean
  // コードを検証して正しければ解除する。戻り値：true=成功 / false=失敗
  unlock: (code: string) => boolean
}

export const useLicense = (): UseLicenseReturn => {
  // localStorageの初期値を参照してstateを初期化
  // ※AppDataとは独立したキーを使用するためデータに影響しない
  const [isUnlocked, setIsUnlocked] = useState<boolean>(
    () => localStorage.getItem(LICENSE_STORAGE_KEY) === 'unlocked',
  )

  const unlock = (code: string): boolean => {
    // 大文字・前後の空白を無視して比較
    if (code.trim().toUpperCase() === LICENSE_CODE) {
      localStorage.setItem(LICENSE_STORAGE_KEY, 'unlocked')
      setIsUnlocked(true)
      return true
    }
    return false
  }

  return { isUnlocked, unlock }
}
