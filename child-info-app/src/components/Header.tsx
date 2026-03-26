// ===========================
// ヘッダーコンポーネント
// ===========================

import { BookHeart } from 'lucide-react'
import { APP_NAME } from '../constants'
import { useTheme } from '../hooks/useTheme'

const Header = () => {
  const { themeId, setThemeId, themes } = useTheme()

  return (
    <header className="bg-rose-brown text-cream shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between gap-3">
        {/* アプリ名 */}
        <div className="flex items-center gap-3">
          <BookHeart size={28} className="text-cream" />
          <h1 className="text-xl font-bold tracking-wide">{APP_NAME}</h1>
        </div>

        {/* テーマ切り替えボタン（丸いカラーボタン3つ） */}
        <div className="flex items-center gap-2">
          {themes.map((theme) => (
            <button
              key={theme.id}
              onClick={() => setThemeId(theme.id)}
              title={theme.name}
              aria-label={`テーマを${theme.name}に変更`}
              className="w-7 h-7 rounded-full transition-all flex-shrink-0"
              style={{
                backgroundColor: theme.color,
                // 選択中のテーマは白枠で強調表示
                outline: themeId === theme.id
                  ? '2px solid rgba(253, 250, 246, 0.9)'
                  : '2px solid transparent',
                outlineOffset: '2px',
              }}
            />
          ))}
        </div>
      </div>
    </header>
  )
}

export default Header
