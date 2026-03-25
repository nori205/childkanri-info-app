import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // アプリカラーパレット
        cream: '#F1E5D1',       // 背景
        'pink-soft': '#DBB5B5', // カード・サブ背景
        'pink-muted': '#C39898', // ボタン・アクセント
        'rose-brown': '#987070', // テキスト・ヘッダー
        'dark-brown': '#5a3a3a', // テキスト本文
      },
    },
  },
  plugins: [],
}

export default config
