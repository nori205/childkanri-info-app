// ===========================
// ヘッダーコンポーネント
// ===========================

import { BookHeart } from 'lucide-react'
import { APP_NAME } from '../constants'

const Header = () => {
  return (
    <header className="bg-rose-brown text-cream shadow-md">
      <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
        <BookHeart size={28} className="text-cream" />
        <h1 className="text-xl font-bold tracking-wide">{APP_NAME}</h1>
      </div>
    </header>
  )
}

export default Header
