// ===========================
// 子供情報カードコンポーネント
// ===========================

import { Cake, School, Droplets, GraduationCap, Ruler, Weight } from 'lucide-react'
import type { Child } from '../types'

interface ChildCardProps {
  child: Child
}

// 年齢を計算する
const calcAge = (birthDate: string): string => {
  const birth = new Date(birthDate)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age--
  }
  return `${age}歳`
}

// 日付を日本語形式に変換
const formatDate = (dateStr: string): string => {
  const d = new Date(dateStr)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const ChildCard = ({ child }: ChildCardProps) => {
  return (
    <div className="bg-pink-soft rounded-2xl p-5 shadow-sm">
      {/* 子供の名前と年齢 */}
      <div className="mb-4">
        <h3 className="text-xl font-bold text-dark-brown">{child.name}</h3>
        <p className="text-rose-brown text-sm mt-0.5">{calcAge(child.birthDate)}</p>
      </div>

      {/* 基本情報グリッド */}
      <div className="space-y-3">
        {/* 生年月日 */}
        <div className="flex items-center gap-3">
          <Cake size={18} className="text-rose-brown flex-shrink-0" />
          <div>
            <p className="text-xs text-rose-brown">生年月日</p>
            <p className="text-sm font-medium text-dark-brown">
              {formatDate(child.birthDate)}
            </p>
          </div>
        </div>

        {/* 学年 */}
        <div className="flex items-center gap-3">
          <GraduationCap size={18} className="text-rose-brown flex-shrink-0" />
          <div>
            <p className="text-xs text-rose-brown">学年</p>
            <p className="text-sm font-medium text-dark-brown">{child.grade}</p>
          </div>
        </div>

        {/* 学校・園名 */}
        {child.schoolName && (
          <div className="flex items-center gap-3">
            <School size={18} className="text-rose-brown flex-shrink-0" />
            <div>
              <p className="text-xs text-rose-brown">学校・園名</p>
              <p className="text-sm font-medium text-dark-brown">
                {child.schoolName}
              </p>
            </div>
          </div>
        )}

        {/* 血液型 */}
        <div className="flex items-center gap-3">
          <Droplets size={18} className="text-rose-brown flex-shrink-0" />
          <div>
            <p className="text-xs text-rose-brown">血液型</p>
            <p className="text-sm font-medium text-dark-brown">{child.bloodType}型</p>
          </div>
        </div>

        {/* 身長・体重 */}
        {(child.height || child.weight) && (
          <div className="flex gap-4">
            {child.height && (
              <div className="flex items-center gap-3">
                <Ruler size={18} className="text-rose-brown flex-shrink-0" />
                <div>
                  <p className="text-xs text-rose-brown">身長</p>
                  <p className="text-sm font-medium text-dark-brown">{child.height} cm</p>
                </div>
              </div>
            )}
            {child.weight && (
              <div className="flex items-center gap-3">
                <Weight size={18} className="text-rose-brown flex-shrink-0" />
                <div>
                  <p className="text-xs text-rose-brown">体重</p>
                  <p className="text-sm font-medium text-dark-brown">{child.weight} kg</p>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default ChildCard
