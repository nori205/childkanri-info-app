// ===========================
// 提出用サマリーセクション
// ===========================

import { useState } from 'react'
import { FileText, ClipboardCopy, Check, User, ShieldAlert, Stethoscope, Thermometer, Syringe, Phone, Lightbulb } from 'lucide-react'
import Accordion from './health/Accordion'
import type {
  Child,
  Allergy,
  Doctor,
  Illness,
  VaccineRecord,
  CustomVaccine,
  HealthMemo,
  FamilyInfo,
} from '../types'

// ── プロップス ─────────────────────────────────────────

interface SummarySectionProps {
  child: Child
  allergies: Allergy[]
  doctors: Doctor[]
  illnesses: Illness[]
  vaccineRecords: VaccineRecord[]
  customVaccines: CustomVaccine[]
  healthMemo: HealthMemo | null
  familyInfo: FamilyInfo
}

// ── ユーティリティ ─────────────────────────────────────

// 日付文字列（YYYY-MM-DD）→ 日本語形式（2026年4月1日）
const formatDateJP = (dateStr: string): string => {
  if (!dateStr) return ''
  const d = new Date(dateStr + 'T00:00:00')
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

// 今日の日付を日本語形式で取得
const todayJP = (): string => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

// ── クリップボード用テキスト生成 ───────────────────────

const buildSummaryText = (props: SummarySectionProps): string => {
  const {
    child,
    allergies,
    doctors,
    illnesses,
    vaccineRecords,
    customVaccines,
    healthMemo,
    familyInfo,
  } = props

  const lines: string[] = []

  // ヘッダー
  lines.push('=== 提出用サマリー ===')
  lines.push(`作成日：${todayJP()}`)
  lines.push('')

  // 【基本情報】
  lines.push('【基本情報】')
  lines.push(`名前：${child.name}`)
  lines.push(`生年月日：${formatDateJP(child.birthDate)}`)
  lines.push(`血液型：${child.bloodType}型`)
  lines.push(`学年：${child.grade}`)
  if (child.schoolName) lines.push(`学校・園名：${child.schoolName}`)
  lines.push('')

  // 【アレルギー・食事制限】
  lines.push('【アレルギー・食事制限】')
  if (allergies.length === 0) {
    lines.push('なし')
  } else {
    allergies.forEach((al) => {
      let line = `・${al.allergen}（重症度：${al.severity}）`
      if (al.treatment) line += `　対処法：${al.treatment}`
      lines.push(line)
      if (al.memo) lines.push(`　メモ：${al.memo}`)
    })
  }
  lines.push('')

  // 【かかりつけ医】
  lines.push('【かかりつけ医】')
  if (doctors.length === 0) {
    lines.push('なし')
  } else {
    doctors.forEach((doc) => {
      let line = `・${doc.specialty}｜${doc.hospitalName}`
      if (doc.phone) line += `｜${doc.phone}`
      lines.push(line)
      if (doc.memo) lines.push(`　メモ：${doc.memo}`)
    })
  }
  lines.push('')

  // 【既往歴】
  lines.push('【既往歴】')
  if (illnesses.length === 0) {
    lines.push('なし')
  } else {
    illnesses.forEach((il) => {
      let period = ''
      if (il.onsetDate) {
        period = `（${formatDateJP(il.onsetDate)}`
        period += il.recoveryDate ? `〜${formatDateJP(il.recoveryDate)}）` : '〜）'
      }
      lines.push(`・${il.name}${period}`)
      if (il.treatment) lines.push(`　治療：${il.treatment}`)
      if (il.memo) lines.push(`　メモ：${il.memo}`)
    })
  }
  lines.push('')

  // 【ワクチン接種済み】
  lines.push('【ワクチン接種済み】')
  const vaccinatedRecords = vaccineRecords.filter((r) => r.vaccinationDate)
  const vaccinatedCustom = customVaccines.filter((cv) => cv.vaccinationDate)
  if (vaccinatedRecords.length === 0 && vaccinatedCustom.length === 0) {
    lines.push('なし')
  } else {
    vaccinatedRecords.forEach((r) => {
      lines.push(`・${r.vaccineName}：${formatDateJP(r.vaccinationDate)}`)
    })
    vaccinatedCustom.forEach((cv) => {
      lines.push(`・${cv.name}：${formatDateJP(cv.vaccinationDate)}`)
    })
  }
  lines.push('')

  // 【緊急連絡先】
  lines.push('【緊急連絡先】')
  lines.push(`保護者名：${familyInfo.parentName || '未記入'}`)
  lines.push(`電話番号：${familyInfo.emergencyContact || '未記入'}`)
  if (familyInfo.address) lines.push(`住所：${familyInfo.address}`)
  lines.push('')

  // 【気づきメモ】
  lines.push('【気づきメモ】')
  lines.push(healthMemo?.content?.trim() || 'なし')

  return lines.join('\n')
}

// ── 表示用サブコンポーネント ──────────────────────────

// セクション見出し
const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex items-center gap-1.5 text-rose-brown font-semibold text-sm mb-2 mt-4 first:mt-0">
    {icon}
    <span>{label}</span>
  </div>
)

// 情報行（ラベル＋値）
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex gap-2 text-sm">
    <span className="text-rose-brown/70 flex-shrink-0 w-20">{label}</span>
    <span className="text-dark-brown">{value || '未記入'}</span>
  </div>
)

// 空の場合のプレースホルダー
const NoneText = () => (
  <p className="text-sm text-dark-brown/40 italic">なし</p>
)

// ── メインコンポーネント ──────────────────────────────

const SummarySection = (props: SummarySectionProps) => {
  const {
    child,
    allergies,
    doctors,
    illnesses,
    vaccineRecords,
    customVaccines,
    healthMemo,
    familyInfo,
  } = props

  const [copied, setCopied] = useState(false)

  // クリップボードへコピーする
  const handleCopy = async () => {
    const text = buildSummaryText(props)
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback：古いブラウザ向け
      const el = document.createElement('textarea')
      el.value = text
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  // 接種済みワクチンのみ
  const vaccinatedRecords = vaccineRecords.filter((r) => r.vaccinationDate)
  const vaccinatedCustom = customVaccines.filter((cv) => cv.vaccinationDate)

  return (
    <Accordion
      title="提出用サマリー"
      icon={<FileText size={18} />}
    >
      {/* 用途説明 */}
      <p className="text-xs text-rose-brown/60 mb-4">
        学校・病院への提出書類を記入する際にご活用ください。
        「コピー」ボタンで全文をクリップボードにコピーできます。
      </p>

      {/* 表示カード */}
      <div className="bg-white rounded-xl border border-pink-soft/60 p-4 space-y-1">

        {/* 作成日 */}
        <p className="text-xs text-rose-brown/50 mb-3">作成日：{todayJP()}</p>

        {/* 基本情報 */}
        <SectionLabel icon={<User size={14} />} label="基本情報" />
        <div className="space-y-1 pl-1">
          <InfoRow label="名前" value={child.name} />
          <InfoRow label="生年月日" value={formatDateJP(child.birthDate)} />
          <InfoRow label="血液型" value={`${child.bloodType}型`} />
          <InfoRow label="学年" value={child.grade} />
          {child.schoolName && <InfoRow label="学校・園名" value={child.schoolName} />}
        </div>

        {/* アレルギー */}
        <SectionLabel icon={<ShieldAlert size={14} />} label="アレルギー・食事制限" />
        <div className="pl-1 space-y-1">
          {allergies.length === 0 ? <NoneText /> : allergies.map((al) => (
            <div key={al.id} className="text-sm text-dark-brown">
              <span className="font-medium">{al.allergen}</span>
              <span className="text-rose-brown/70 text-xs ml-1">（{al.severity}度）</span>
              {al.treatment && (
                <span className="text-dark-brown/60 text-xs ml-1">対処：{al.treatment}</span>
              )}
            </div>
          ))}
        </div>

        {/* かかりつけ医 */}
        <SectionLabel icon={<Stethoscope size={14} />} label="かかりつけ医" />
        <div className="pl-1 space-y-1">
          {doctors.length === 0 ? <NoneText /> : doctors.map((doc) => (
            <div key={doc.id} className="text-sm text-dark-brown">
              <span className="text-rose-brown/70 text-xs mr-1">{doc.specialty}</span>
              <span className="font-medium">{doc.hospitalName}</span>
              {doc.phone && (
                <span className="text-dark-brown/60 text-xs ml-2 inline-flex items-center gap-0.5">
                  <Phone size={10} />{doc.phone}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* 既往歴 */}
        <SectionLabel icon={<Thermometer size={14} />} label="既往歴" />
        <div className="pl-1 space-y-1">
          {illnesses.length === 0 ? <NoneText /> : illnesses.map((il) => (
            <div key={il.id} className="text-sm text-dark-brown">
              <span className="font-medium">{il.name}</span>
              {il.onsetDate && (
                <span className="text-dark-brown/50 text-xs ml-1">
                  （{formatDateJP(il.onsetDate)}
                  {il.recoveryDate ? `〜${formatDateJP(il.recoveryDate)}` : '〜'}）
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ワクチン接種済み */}
        <SectionLabel icon={<Syringe size={14} />} label="ワクチン接種済み" />
        <div className="pl-1 space-y-1">
          {vaccinatedRecords.length === 0 && vaccinatedCustom.length === 0 ? (
            <NoneText />
          ) : (
            <>
              {vaccinatedRecords.map((r) => (
                <div key={r.id} className="text-sm text-dark-brown">
                  <span className="font-medium">{r.vaccineName}</span>
                  <span className="text-dark-brown/50 text-xs ml-1">
                    {formatDateJP(r.vaccinationDate)}
                  </span>
                </div>
              ))}
              {vaccinatedCustom.map((cv) => (
                <div key={cv.id} className="text-sm text-dark-brown">
                  <span className="font-medium">{cv.name}</span>
                  <span className="text-dark-brown/50 text-xs ml-1">
                    {formatDateJP(cv.vaccinationDate)}
                  </span>
                </div>
              ))}
            </>
          )}
        </div>

        {/* 緊急連絡先 */}
        <SectionLabel icon={<Phone size={14} />} label="緊急連絡先" />
        <div className="space-y-1 pl-1">
          <InfoRow label="保護者名" value={familyInfo.parentName} />
          <InfoRow label="電話番号" value={familyInfo.emergencyContact} />
          {familyInfo.address && <InfoRow label="住所" value={familyInfo.address} />}
        </div>

        {/* 気づきメモ */}
        <SectionLabel icon={<Lightbulb size={14} />} label="気づきメモ" />
        <div className="pl-1">
          {healthMemo?.content?.trim() ? (
            <p className="text-sm text-dark-brown whitespace-pre-wrap">
              {healthMemo.content.trim()}
            </p>
          ) : (
            <NoneText />
          )}
        </div>
      </div>

      {/* コピーボタン */}
      <button
        onClick={handleCopy}
        className={`mt-4 w-full flex items-center justify-center gap-2 py-3 rounded-xl font-medium shadow transition-all ${
          copied
            ? 'bg-green-500/80 text-white'
            : 'bg-pink-muted text-cream hover:opacity-90 active:opacity-80'
        }`}
      >
        {copied ? (
          <>
            <Check size={16} />
            コピーしました！
          </>
        ) : (
          <>
            <ClipboardCopy size={16} />
            クリップボードにコピー
          </>
        )}
      </button>
    </Accordion>
  )
}

export default SummarySection
