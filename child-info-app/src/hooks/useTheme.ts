// ===========================
// テーマ管理フック
// ===========================

import { useState, useEffect } from 'react'

// テーマのID
export type ThemeId = 'pink' | 'lavender' | 'mint'

// テーマ定義の型
export interface Theme {
  id: ThemeId
  name: string
  // テーマ選択ボタンの表示色
  color: string
}

// テーマ一覧
export const THEMES: Theme[] = [
  { id: 'pink',     name: 'くすみピンク', color: '#A98B76' },
  { id: 'lavender', name: 'ラベンダー',   color: '#281C59' },
  { id: 'mint',     name: 'ミントベージュ', color: '#7EACB5' },
]

// localStorageのキー
const THEME_STORAGE_KEY = 'child-info-app-theme'

// デフォルトテーマ
const DEFAULT_THEME: ThemeId = 'pink'

// テーマIDが有効かチェック
const isValidThemeId = (id: string): id is ThemeId =>
  THEMES.some((t) => t.id === id)

export const useTheme = () => {
  // localStorageから初期テーマを読み込む
  const [themeId, setThemeIdState] = useState<ThemeId>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY)
    return saved && isValidThemeId(saved) ? saved : DEFAULT_THEME
  })

  // テーマ変更時にdata-theme属性とlocalStorageを更新
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', themeId)
    localStorage.setItem(THEME_STORAGE_KEY, themeId)
  }, [themeId])

  const setThemeId = (id: ThemeId) => {
    setThemeIdState(id)
  }

  return { themeId, setThemeId, themes: THEMES }
}
