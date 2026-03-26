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

// 定期接種ワクチンのマスタリスト
export const SCHEDULED_VACCINES: string[] = [
  'BCG（結核）',
  'B型肝炎',
  'ヒブ（Hib）',
  '小児用肺炎球菌',
  'ロタウイルス',
  '四種混合（DPT-IPV）',
  '麻しん・風しん（MR）',
  '水痘（水ぼうそう）',
  'おたふくかぜ',
  '日本脳炎',
  '二種混合（DT）',
  'HPV（子宮頸がん）',
]

// 任意接種ワクチンのマスタリスト
export const OPTIONAL_VACCINES: string[] = [
  'インフルエンザ',
  'A型肝炎',
  '髄膜炎菌',
  'おたふくかぜ（追加分）',
]

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
