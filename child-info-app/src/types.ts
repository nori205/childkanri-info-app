// ===========================
// 全型定義（src/types.ts）
// ===========================

// 血液型
export type BloodType = 'A' | 'B' | 'O' | 'AB' | '不明'

// 学年
export type GradeType =
  | '未就学'
  | '保育園・幼稚園'
  | '小学1年'
  | '小学2年'
  | '小学3年'
  | '小学4年'
  | '小学5年'
  | '小学6年'
  | '中学1年'
  | '中学2年'
  | '中学3年'
  | '高校1年'
  | '高校2年'
  | '高校3年'
  | 'その他'

// 子供の基本情報
export interface Child {
  id: string
  name: string
  birthDate: string      // ISO形式 YYYY-MM-DD
  grade: GradeType
  schoolName: string
  bloodType: BloodType
  createdAt: string      // ISO形式
  updatedAt: string      // ISO形式
}

// 子供追加・編集フォームの入力値
export interface ChildFormValues {
  name: string
  birthDate: string
  grade: GradeType
  schoolName: string
  bloodType: BloodType
}

// 家族メンバー（複数登録可）
export interface FamilyMember {
  id: string
  name: string          // 名前
  relationship: string  // 続柄（父・母・祖父・祖母など）
  phone: string         // 電話番号（任意）
}

// 家族共通情報
export interface FamilyInfo {
  members: FamilyMember[]  // 家族メンバー一覧
  address: string          // 住所（家族共通）
  updatedAt: string        // ISO形式
}

// ===========================
// ステップ②：タスク管理
// ===========================

// タスクの種類
export type TaskCategory =
  | '書類提出'
  | '持ち物チェック'
  | '記入・署名'
  | '支払い・入金'
  | 'その他'

// タスク
export interface Task {
  id: string
  childId: string           // 紐付く子供のID
  title: string             // タイトル（必須）
  category: TaskCategory
  dueDate: string | null    // 期限日 YYYY-MM-DD（任意）
  memo: string              // メモ（任意）
  amount: number | null     // 金額（支払い・入金のみ）
  completed: boolean
  createdAt: string         // ISO形式
  updatedAt: string         // ISO形式
}

// タスク追加フォームの入力値
export interface TaskFormValues {
  title: string
  category: TaskCategory
  dueDate: string
  memo: string
  amount: string            // フォームでは文字列として扱う
}

// ===========================
// ステップ③：健康・医療情報
// ===========================

// かかりつけ医
export interface Doctor {
  id: string
  childId: string
  specialty: string       // 診療科
  hospitalName: string    // 病院名（必須）
  phone: string           // 電話番号
  memo: string
  createdAt: string
}

// アレルギー重症度
export type AllergySeverity = '軽' | '中' | '重'

// アレルギー・食事制限
export interface Allergy {
  id: string
  childId: string
  allergen: string        // アレルゲン名（必須）
  severity: AllergySeverity
  treatment: string       // 対処法
  memo: string            // 経験者メモ
  createdAt: string
}

// 病気履歴
export interface Illness {
  id: string
  childId: string
  name: string            // 病名（必須）
  onsetDate: string       // 発症日 YYYY-MM-DD
  recoveryDate: string    // 回復日 YYYY-MM-DD（任意）
  treatment: string       // 治療内容
  memo: string            // 経験者メモ
  createdAt: string
}

// 経験者の気づきメモ（子供ごと）
export interface HealthMemo {
  childId: string
  content: string         // 自由記述
  updatedAt: string
}

// ===========================
// ステップ⑦：通院・予約管理
// ===========================

// 通院・予約の1件
export interface Appointment {
  id: string
  childId: string
  date: string        // YYYY-MM-DD（必須）
  content: string     // 内容 例：小児科・療育・皮膚科（必須）
  location: string    // 病院名・場所（任意）
  memo: string        // メモ（任意）
  createdAt: string
}

// ===========================
// ステップ④：ワクチン記録
// ===========================

// ワクチン種別（定期 / 任意）
export type VaccineType = 'scheduled' | 'optional'

// 定期・任意接種の記録（子供 × ワクチン名で1レコード）
export interface VaccineRecord {
  id: string
  childId: string
  vaccineName: string       // マスタのワクチン名
  vaccineType: VaccineType
  vaccinationDate: string   // 接種日 YYYY-MM-DD（空文字＝未接種）
  nextDate: string          // 次回予定日 YYYY-MM-DD（任意）
  memo: string
  updatedAt: string
}

// 個別追加ワクチン（自由入力）
export interface CustomVaccine {
  id: string
  childId: string
  name: string              // ワクチン名（必須）
  reason: string            // 接種理由
  vaccinationDate: string   // 接種日
  nextDate: string          // 次回予定日
  memo: string
  createdAt: string
}

// localStorageに保存するアプリ全体のデータ構造
// ステップ②以降でフィールドを追加していく
export interface AppData {
  version: number           // データ構造のバージョン（マイグレーション用）
  children: Child[]
  familyInfo: FamilyInfo
  tasks: Task[]             // ステップ②追加
  doctors: Doctor[]         // ステップ③追加
  allergies: Allergy[]      // ステップ③追加
  illnesses: Illness[]      // ステップ③追加
  healthMemos: HealthMemo[] // ステップ③追加
  vaccineRecords: VaccineRecord[]  // ステップ④追加
  customVaccines: CustomVaccine[]  // ステップ④追加
  appointments: Appointment[]      // ステップ⑦追加
}
