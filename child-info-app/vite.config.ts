import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // 新しいバージョンがあれば自動で更新する
      registerType: 'autoUpdate',
      manifest: {
        name: 'こどめも',
        short_name: 'こどめも',
        description: '子供の情報をまとめて管理するアプリ',
        start_url: '/',
        display: 'standalone',
        background_color: '#fdf6f0',
        theme_color: '#c97b6a',
        icons: [
          {
            src: '/icon.png',
            sizes: 'any',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        // アプリのファイルをキャッシュする
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        // 古いキャッシュを自動削除して確実に最新版を表示する
        cleanupOutdatedCaches: true,
      },
    }),
  ],
})
