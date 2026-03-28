// ===========================
// 印刷用サマリーコンポーネント
// createPortal で document.body に直接マウントし、
// @media print でのみ表示される A4 レイアウト。
// 情報が多い場合は自動で複数ページに流れるが、
// セクションの途中で改ページされないよう制御する。
// ===========================

import { createPortal } from 'react-dom'
import type {
  Child,
  Allergy,
  Doctor,
  Illness,
  VaccineRecord,
  CustomVaccine,
  HealthMemo,
  FamilyInfo,
  WelfareProvider,
  WelfareConsultant,
  DiagnosisInfo,
} from '../types'

// ── プロップス ─────────────────────────────────────────

interface PrintSummaryProps {
  child: Child
  allergies: Allergy[]
  doctors: Doctor[]
  illnesses: Illness[]
  vaccineRecords: VaccineRecord[]
  customVaccines: CustomVaccine[]
  healthMemo: HealthMemo | null
  familyInfo: FamilyInfo
  welfareProviders: WelfareProvider[]
  welfareConsultants: WelfareConsultant[]
  diagnosisInfo: DiagnosisInfo | null
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

// ── 印刷用サブコンポーネント ──────────────────────────

// セクションタイトル（テーマカラー背景・白文字）
const SectionTitle = ({ title }: { title: string }) => (
  <div
    style={{
      backgroundColor: 'rgb(var(--color-main))',
      color: 'white',
      padding: '3px 8px',
      fontWeight: 'bold',
      fontSize: '10px',
      marginBottom: '5px',
      borderRadius: '2px',
    }}
  >
    {title}
  </div>
)

// 情報行（ラベル＋値）
const Row = ({ label, value }: { label: string; value: string }) => {
  if (!value) return null
  return (
    <div style={{ display: 'flex', gap: '4px', fontSize: '10px', lineHeight: '1.65' }}>
      <span style={{ color: '#888', flexShrink: 0, width: '68px' }}>{label}</span>
      <span style={{ color: '#333' }}>{value}</span>
    </div>
  )
}

// ── スタイル定数 ──────────────────────────────────────

// セクション枠（改ページ制御付き）
const sectionStyle: React.CSSProperties = {
  border: '1px solid #ddd',
  borderRadius: '4px',
  padding: '7px 9px',
  marginBottom: '7px',
  pageBreakInside: 'avoid',   // 旧ブラウザ向け
  breakInside: 'avoid',       // 標準仕様
}

// 2列グリッド（改ページ制御付き）
const twoColStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '7px',
  marginBottom: '7px',
  pageBreakInside: 'avoid',
  breakInside: 'avoid',
}

// ── メインコンポーネント ──────────────────────────────

const PrintSummary = (props: PrintSummaryProps) => {
  const {
    child,
    allergies,
    doctors,
    illnesses,
    vaccineRecords,
    customVaccines,
    healthMemo,
    familyInfo,
    welfareProviders,
    welfareConsultants,
    diagnosisInfo,
  } = props

  // 接種済みワクチンのみ
  const vaccinatedRecords = vaccineRecords.filter((r) => r.vaccinationDate)
  const vaccinatedCustom = customVaccines.filter((cv) => cv.vaccinationDate)

  // 福祉情報の有無判定
  const hasDiagnosis = !!(diagnosisInfo?.diagnosisName || diagnosisInfo?.hasHandbook)
  const hasWelfare = hasDiagnosis || welfareProviders.length > 0 || welfareConsultants.length > 0

  const content = (
    <div
      id="print-summary-area"
      style={{
        // 通常時は非表示（@media print で display: block に上書きされる）
        display: 'none',
        fontFamily: '"Zen Maru Gothic", "Hiragino Sans", "Hiragino Kaku Gothic ProN", sans-serif',
        fontSize: '10px',
        color: '#333',
        lineHeight: '1.6',
        padding: '0',
      }}
    >
      {/* ── タイトル・作成日 ── */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '10px',
          paddingBottom: '8px',
          borderBottom: '2px solid rgb(var(--color-main))',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        <h1
          style={{
            fontSize: '15px',
            fontWeight: 'bold',
            color: 'rgb(var(--color-main))',
            margin: 0,
            letterSpacing: '0.05em',
          }}
        >
          こどめも｜提出用サマリー
        </h1>
        <p style={{ fontSize: '9px', color: '#999', margin: '2px 0 0' }}>
          作成日：{todayJP()}
        </p>
      </div>

      {/* ── 基本情報 ＋ 緊急連絡先（2列） ── */}
      <div style={twoColStyle}>
        {/* 基本情報 */}
        <div style={sectionStyle}>
          <SectionTitle title="基本情報" />
          <Row label="名前" value={child.name} />
          <Row label="生年月日" value={formatDateJP(child.birthDate)} />
          <Row label="血液型" value={`${child.bloodType}型`} />
          <Row label="学年" value={child.grade} />
          {child.schoolName && <Row label="学校・園名" value={child.schoolName} />}
        </div>

        {/* 緊急連絡先 */}
        <div style={sectionStyle}>
          <SectionTitle title="緊急連絡先" />
          {familyInfo.members.length === 0 ? (
            <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>未記入</p>
          ) : (
            familyInfo.members.map((m) => (
              <div key={m.id} style={{ fontSize: '10px', lineHeight: '1.65' }}>
                <span style={{ color: '#888' }}>{m.relationship}：</span>
                <span style={{ fontWeight: 'bold' }}>{m.name}</span>
                {m.phone && (
                  <span style={{ color: '#555', marginLeft: '6px' }}>{m.phone}</span>
                )}
              </div>
            ))
          )}
          {familyInfo.address && (
            <div style={{ display: 'flex', gap: '4px', fontSize: '10px', lineHeight: '1.65', marginTop: '3px' }}>
              <span style={{ color: '#888', flexShrink: 0 }}>住所：</span>
              <span style={{ color: '#333' }}>{familyInfo.address}</span>
            </div>
          )}
        </div>
      </div>

      {/* ── アレルギー・食事制限 ── */}
      <div style={sectionStyle}>
        <SectionTitle title="アレルギー・食事制限" />
        {allergies.length === 0 ? (
          <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>なし</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3px' }}>
            {allergies.map((al) => (
              <div
                key={al.id}
                style={{ display: 'flex', alignItems: 'baseline', gap: '6px', fontSize: '10px', lineHeight: '1.65' }}
              >
                <span style={{ fontWeight: 'bold' }}>{al.allergen}</span>
                {/* 重症度バッジ */}
                <span
                  style={{
                    fontSize: '8px',
                    padding: '1px 5px',
                    borderRadius: '10px',
                    fontWeight: 'bold',
                    backgroundColor:
                      al.severity === '重' ? '#fee2e2'
                      : al.severity === '中' ? '#fef9c3'
                      : '#f0fdf4',
                    color:
                      al.severity === '重' ? '#b91c1c'
                      : al.severity === '中' ? '#854d0e'
                      : '#166534',
                  }}
                >
                  {al.severity}度
                </span>
                {al.treatment && (
                  <span style={{ color: '#555' }}>対処：{al.treatment}</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── かかりつけ医 ＋ 既往歴（2列） ── */}
      <div style={twoColStyle}>
        {/* かかりつけ医 */}
        <div style={sectionStyle}>
          <SectionTitle title="かかりつけ医" />
          {doctors.length === 0 ? (
            <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>なし</p>
          ) : (
            doctors.map((doc) => (
              <div key={doc.id} style={{ fontSize: '10px', lineHeight: '1.65', marginBottom: '4px' }}>
                <span style={{ color: '#888' }}>{doc.specialty}　</span>
                <span style={{ fontWeight: 'bold' }}>{doc.hospitalName}</span>
                {doc.phone && (
                  <div style={{ color: '#555', paddingLeft: '2px' }}>TEL：{doc.phone}</div>
                )}
              </div>
            ))
          )}
        </div>

        {/* 既往歴 */}
        <div style={sectionStyle}>
          <SectionTitle title="既往歴" />
          {illnesses.length === 0 ? (
            <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>なし</p>
          ) : (
            illnesses.map((il) => (
              <div key={il.id} style={{ fontSize: '10px', lineHeight: '1.65', marginBottom: '3px' }}>
                <span style={{ fontWeight: 'bold' }}>{il.name}</span>
                {il.onsetDate && (
                  <span style={{ color: '#888', marginLeft: '4px', fontSize: '9px' }}>
                    （{formatDateJP(il.onsetDate)}
                    {il.recoveryDate ? `〜${formatDateJP(il.recoveryDate)}` : '〜'}）
                  </span>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── ワクチン接種済み一覧 ── */}
      <div style={sectionStyle}>
        <SectionTitle title="ワクチン接種済み一覧" />
        {vaccinatedRecords.length === 0 && vaccinatedCustom.length === 0 ? (
          <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>なし</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px 12px' }}>
            {vaccinatedRecords.map((r) => (
              <div key={r.id} style={{ fontSize: '10px', lineHeight: '1.65' }}>
                <span style={{ fontWeight: 'bold' }}>{r.vaccineName}</span>
                <span style={{ color: '#888', marginLeft: '4px', fontSize: '9px' }}>
                  {formatDateJP(r.vaccinationDate)}
                </span>
              </div>
            ))}
            {vaccinatedCustom.map((cv) => (
              <div key={cv.id} style={{ fontSize: '10px', lineHeight: '1.65' }}>
                <span style={{ fontWeight: 'bold' }}>{cv.name}</span>
                <span style={{ color: '#888', marginLeft: '4px', fontSize: '9px' }}>
                  {formatDateJP(cv.vaccinationDate)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── 福祉・診断情報（データがある場合のみ表示） ── */}
      {hasWelfare && (
        <>
          {/* 診断名・手帳 ＋ 福祉サービス事業者（2列） */}
          {(hasDiagnosis || welfareProviders.length > 0) && (
            <div style={twoColStyle}>
              {/* 診断名・手帳（あれば） */}
              {hasDiagnosis && (
                <div style={sectionStyle}>
                  <SectionTitle title="診断名・手帳" />
                  {diagnosisInfo?.diagnosisName && (
                    <div style={{ fontSize: '10px', lineHeight: '1.65' }}>
                      <span style={{ color: '#888' }}>診断名：</span>
                      <span style={{ fontWeight: 'bold' }}>{diagnosisInfo.diagnosisName}</span>
                    </div>
                  )}
                  {diagnosisInfo?.hasHandbook && (
                    <div style={{ fontSize: '10px', lineHeight: '1.65' }}>
                      <span style={{ color: '#888' }}>手帳：</span>
                      <span>あり{diagnosisInfo.handbookName ? `（${diagnosisInfo.handbookName}）` : ''}</span>
                    </div>
                  )}
                </div>
              )}

              {/* 福祉サービス事業者（あれば） */}
              {welfareProviders.length > 0 && (
                <div style={sectionStyle}>
                  <SectionTitle title="福祉サービス事業者" />
                  {welfareProviders.map((wp) => (
                    <div key={wp.id} style={{ fontSize: '10px', lineHeight: '1.65' }}>
                      <span style={{ fontWeight: 'bold' }}>{wp.name}</span>
                      {wp.phone && (
                        <span style={{ color: '#555', marginLeft: '6px' }}>{wp.phone}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 相談支援専門員（あれば） */}
          {welfareConsultants.length > 0 && (
            <div style={sectionStyle}>
              <SectionTitle title="相談支援専門員" />
              {welfareConsultants.map((wc) => (
                <div key={wc.id} style={{ fontSize: '10px', lineHeight: '1.65' }}>
                  <span style={{ fontWeight: 'bold' }}>{wc.name}</span>
                  {wc.office && (
                    <span style={{ color: '#888', marginLeft: '4px' }}>（{wc.office}）</span>
                  )}
                  {wc.phone && (
                    <span style={{ color: '#555', marginLeft: '6px' }}>{wc.phone}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── 気づきメモ ── */}
      <div style={sectionStyle}>
        <SectionTitle title="気づきメモ" />
        {healthMemo?.content?.trim() ? (
          <p style={{ fontSize: '10px', whiteSpace: 'pre-wrap', lineHeight: '1.7', margin: 0, color: '#333' }}>
            {healthMemo.content.trim()}
          </p>
        ) : (
          <p style={{ fontSize: '10px', color: '#bbb', margin: 0 }}>なし</p>
        )}
      </div>

      {/* ── フッター ── */}
      <div
        style={{
          textAlign: 'center',
          marginTop: '8px',
          paddingTop: '6px',
          borderTop: '1px solid #eee',
          fontSize: '8px',
          color: '#bbb',
          pageBreakInside: 'avoid',
          breakInside: 'avoid',
        }}
      >
        こどめも で作成
      </div>
    </div>
  )

  // createPortal で document.body に直接マウント
  // → body > *:not(#print-summary-area) の CSS セレクタが正しく機能する
  return createPortal(content, document.body)
}

export default PrintSummary
