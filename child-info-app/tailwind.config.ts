import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      // Zen Maru Gothic を先頭に追加
      fontFamily: {
        sans: ['"Zen Maru Gothic"', 'Hiragino Sans', '"Hiragino Kaku Gothic ProN"', '"Noto Sans JP"', 'sans-serif'],
      },
      colors: {
        // CSS変数（RGBチャンネル形式）でテーマ切り替えに対応
        // opacity修飾子（/60など）を使うためにRGBチャンネル形式が必要
        cream:        'rgb(var(--color-bg)   / <alpha-value>)', // 背景色 #FAF1E6
        'pink-soft':  'rgb(var(--color-card) / <alpha-value>)', // カード内 #FDFAF6
        'pink-muted': 'rgb(var(--color-main) / <alpha-value>)', // テーマメインカラー（ボタン等）
        'rose-brown': 'rgb(var(--color-main) / <alpha-value>)', // テーマメインカラー（テキスト・ヘッダー等）
        'dark-brown': 'rgb(90 58 58 / <alpha-value>)',          // 本文テキスト #5a3a3a（固定）
        // バックアップボタン用（テーマ別）
        'backup-bg':   'rgb(var(--color-backup-bg)   / <alpha-value>)',
        'backup-text': 'rgb(var(--color-backup-text) / <alpha-value>)',
        // タスクサマリー固定カラー
        'today-red':    '#D53E0F',
        'week-yellow':  '#FFD400',
        'pending-blue': '#3291B6',
      },
    },
  },
  plugins: [],
}

export default config
