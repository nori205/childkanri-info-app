// ===========================
// 全定数（src/constants.ts）
// ===========================

import type { BloodType, GradeType, FamilyInfo, TaskCategory, AllergySeverity } from './types'

// localStorageのキー
export const STORAGE_KEY = 'child-info-app-data'

// データ構造のバージョン（変更時はマイグレーション処理を追加）
export const DATA_VERSION = 1

// 血液型の選択肢
export const BLOOD_TYPES: BloodType[] = ['A', 'B', 'O', 'AB', '不明']

// 学年の選択肢
export const GRADE_TYPES: GradeType[] = [
  '未就学',
  '保育園・幼稚園',
  '小学1年',
  '小学2年',
  '小学3年',
  '小学4年',
  '小学5年',
  '小学6年',
  '中学1年',
  '中学2年',
  '中学3年',
  '高校1年',
  '高校2年',
  '高校3年',
  'その他',
]

// 家族情報の初期値
export const DEFAULT_FAMILY_INFO: FamilyInfo = {
  members: [],
  address: '',
  updatedAt: new Date().toISOString(),
}

// 無料版で追加できる医療情報の最大件数（カテゴリごと）
export const FREE_HEALTH_LIMIT = 2

// アプリ名
export const APP_NAME = 'こどめも'

// ===========================
// ステップ②：タスク管理
// ===========================

// タスク種類の選択肢
export const TASK_CATEGORIES: TaskCategory[] = [
  '書類提出',
  '持ち物チェック',
  '記入・署名',
  '支払い・入金',
  'その他',
]

// タスク種類ごとのアイコン名（lucide-react）
export const TASK_CATEGORY_ICON: Record<TaskCategory, string> = {
  '書類提出': 'FileText',
  '持ち物チェック': 'ShoppingBag',
  '記入・署名': 'PenLine',
  '支払い・入金': 'Banknote',
  'その他': 'Circle',
}

// 期限の警告しきい値（日数）
export const DUE_WARN_DAYS = 3

// ===========================
// ステップ③：健康・医療情報
// ===========================

// アレルギー重症度の選択肢
export const ALLERGY_SEVERITIES: AllergySeverity[] = ['軽', '中', '重']

// 診療科の選択肢（よく使うもの）
export const SPECIALTY_OPTIONS: string[] = [
  '小児科',
  '内科',
  '耳鼻咽喉科',
  '眼科',
  '皮膚科',
  '整形外科',
  '歯科',
  '外科',
  'その他',
]

// 重症度バッジの色クラス
export const SEVERITY_COLOR: Record<AllergySeverity, string> = {
  軽: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  中: 'bg-orange-100 text-orange-700 border-orange-200',
  重: 'bg-red-100 text-red-600 border-red-200',
}

// ===========================
// ステップ④：ワクチン記録
// ===========================

// 定期接種ワクチンのマスタリスト（厚生労働省 2024年4月改定準拠）
export const SCHEDULED_VACCINES: string[] = [
  '五種混合（DPT-IPV-Hib）',    // 2024年4月〜定期接種化
  'BCG（結核）',
  'B型肝炎',
  '小児用肺炎球菌（PCV）',
  'ロタウイルス',
  '麻しん・風しん（MR）',
  '水痘（水ぼうそう）',
  '日本脳炎',
  '二種混合（DT）',
  'HPV（ヒトパピローマウイルス）',
  'ヒブ（Hib）',                // 2024年3月以前に接種開始した場合
  '四種混合（DPT-IPV）',        // 2024年3月以前に接種開始した場合
]

// 任意接種ワクチンのマスタリスト
export const OPTIONAL_VACCINES: string[] = [
  'おたふくかぜ（ムンプス）',
  'インフルエンザ',
  'A型肝炎',
  '髄膜炎菌',
]

// 各ワクチンの推奨接種時期ヒント
export const VACCINE_HINTS: Record<string, string> = {
  '五種混合（DPT-IPV-Hib）':      '生後2か月から。初回3回（20〜56日間隔）＋追加1回（初回終了後6〜18か月後）',
  'BCG（結核）':                   '生後5〜8か月が標準。1回のみ',
  'B型肝炎':                       '生後2か月から。3回接種（1回目から27日後・139日後が目安）',
  '小児用肺炎球菌（PCV）':         '生後2か月から。初回3回（27日以上間隔）＋追加1回（生後12〜15か月）',
  'ロタウイルス':                   '生後6〜24週。2回（ロタリックス）または3回（ロタテック）接種',
  '麻しん・風しん（MR）':          '1期：1歳。2期：就学前の1年間（年長さん）',
  '水痘（水ぼうそう）':            '1歳から。2回接種（1回目から6〜12か月後）',
  '日本脳炎':                      '1期：3歳（2回接種、6〜28日間隔）＋追加1回（1年後）。2期：9歳',
  '二種混合（DT）':                '11歳（小学6年生ごろ）。1回のみ',
  'HPV（ヒトパピローマウイルス）': '小学6年〜高校1年相当の女子。2〜3回接種（種類により異なる）',
  'ヒブ（Hib）':                   '生後2か月から。初回3回＋追加1回（2024年3月以前開始のスケジュール）',
  '四種混合（DPT-IPV）':           '生後2か月から。初回3回（20〜56日間隔）＋追加1回（2024年3月以前開始のスケジュール）',
  'おたふくかぜ（ムンプス）':      '1歳から。2回接種推奨（1回目から2〜6年後）',
  'インフルエンザ':                '毎年秋（10〜11月ごろ）。13歳未満は2回接種（2〜4週間隔）',
  'A型肝炎':                       '2回接種（2〜4週間隔）。海外渡航前などに推奨',
  '髄膜炎菌':                      '海外留学・渡航前などに推奨。1〜2回接種',
}

// 次回予定日の警告しきい値（日数）
export const VACCINE_WARN_DAYS = 7

// ===========================
// ステップ⑥：ライセンス管理
// ===========================

// 解除コード（環境変数から読み込む）
// ローカル: .env の VITE_LICENSE_CODE
// Vercel: Settings > Environment Variables > VITE_LICENSE_CODE
// 環境変数が未設定の場合は空文字（どのコードでも解除不可）
export const LICENSE_CODE: string = import.meta.env.VITE_LICENSE_CODE ?? ''

// ライセンス解除状態を保存するlocalStorageキー
// ※アプリデータ（STORAGE_KEY）とは独立しているため、データには影響しない
export const LICENSE_STORAGE_KEY = 'child-info-app-license'

// デモ版で無料利用できる子供の最大人数
export const FREE_CHILD_LIMIT = 1
