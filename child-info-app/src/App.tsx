// ===========================
// アプリのルートコンポーネント
// ===========================

import { useState, useCallback, useEffect } from 'react'
import { Plus } from 'lucide-react'
import Header from './components/Header'
import ChildTabs from './components/ChildTabs'
import EmptyState from './components/EmptyState'
import AddChildModal from './components/AddChildModal'
import AddTaskModal from './components/AddTaskModal'
import TaskSummary from './components/TaskSummary'
import ScheduleView from './components/ScheduleView'
import TaskList from './components/TaskList'
import FamilyInfo from './components/FamilyInfo'
import HealthSection from './components/health/HealthSection'
import SummarySection from './components/SummarySection'
import LicenseGate, {
  LicenseBanner,
  UnlockModal,
  ChildLimitModal,
} from './components/LicenseGate'
import { useChildren } from './hooks/useChildren'
import { useFamilyInfo } from './hooks/useFamilyInfo'
import { useTasks } from './hooks/useTasks'
import { useHealth } from './hooks/useHealth'
import { useLicense } from './hooks/useLicense'
import type {
  AppData,
  Child,
  FamilyInfo as FamilyInfoType,
  Task,
  Doctor,
  Allergy,
  Illness,
  HealthMemo,
  VaccineRecord,
  VaccineType,
  CustomVaccine,
  Appointment,
} from './types'
import { STORAGE_KEY, DATA_VERSION, DEFAULT_FAMILY_INFO, FREE_CHILD_LIMIT } from './constants'
import type { FamilyMember } from './types'

// バックアップリマインドのlocalStorageキー
const BACKUP_LAST_KEY = 'child-info-app-last-backup'
// 何日経ったらリマインドするか
const BACKUP_REMIND_DAYS = 7

// localStorageからアプリデータを読み込む
// ※ライセンスデータは別キー（LICENSE_STORAGE_KEY）で管理するためここには含まない
// 旧フォーマット（parentName/emergencyContact）を新フォーマット（members）に移行する
const migrateFamilyInfo = (raw: Record<string, unknown>): FamilyInfoType => {
  if (!raw) return DEFAULT_FAMILY_INFO
  // 旧フォーマット：parentNameフィールドが存在する場合
  if ('parentName' in raw) {
    const members: FamilyMember[] = []
    if (raw.parentName) {
      members.push({
        id: crypto.randomUUID(),
        name: raw.parentName as string,
        relationship: '保護者',
        phone: (raw.emergencyContact as string) ?? '',
      })
    }
    return {
      members,
      address: (raw.address as string) ?? '',
      updatedAt: (raw.updatedAt as string) ?? new Date().toISOString(),
    }
  }
  // 新フォーマットのままを返す
  return raw as unknown as FamilyInfoType
}

const loadAppData = (): AppData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) throw new Error('no data')
    const data = JSON.parse(raw) as Partial<AppData>
    return {
      version: data.version ?? DATA_VERSION,
      children: data.children ?? [],
      familyInfo: migrateFamilyInfo(data.familyInfo as unknown as Record<string, unknown>),
      tasks: data.tasks ?? [],
      doctors: data.doctors ?? [],
      allergies: data.allergies ?? [],
      illnesses: data.illnesses ?? [],
      healthMemos: data.healthMemos ?? [],
      vaccineRecords: data.vaccineRecords ?? [],
      customVaccines: data.customVaccines ?? [],
      appointments: data.appointments ?? [],    // ステップ⑦追加
    }
  } catch {
    return {
      version: DATA_VERSION,
      children: [],
      familyInfo: DEFAULT_FAMILY_INFO,
      tasks: [],
      doctors: [],
      allergies: [],
      illnesses: [],
      healthMemos: [],
      vaccineRecords: [],
      customVaccines: [],
      appointments: [],                          // ステップ⑦追加
    }
  }
}

// localStorageへアプリデータを保存する
const saveAppData = (data: AppData): void => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

const App = () => {
  const initialData = loadAppData()

  // ── モーダルの表示状態 ────────────────────────────

  const [isChildModalOpen, setIsChildModalOpen] = useState(false)
  // バックアップリマインドバナーの表示状態
  const [showBackupReminder, setShowBackupReminder] = useState(false)

  // 起動時にバックアップリマインドを確認
  useEffect(() => {
    const last = localStorage.getItem(BACKUP_LAST_KEY)
    if (!last) {
      // 一度もバックアップしていない場合はデータがあれば表示
      const hasData = !!localStorage.getItem(STORAGE_KEY)
      if (hasData) setShowBackupReminder(true)
      return
    }
    const daysSince = (Date.now() - Number(last)) / (1000 * 60 * 60 * 24)
    if (daysSince >= BACKUP_REMIND_DAYS) setShowBackupReminder(true)
  }, [])
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  // 解除コード入力モーダル
  const [isUnlockModalOpen, setIsUnlockModalOpen] = useState(false)
  // 子供追加制限モーダル
  const [isChildLimitModalOpen, setIsChildLimitModalOpen] = useState(false)

  // ── ライセンス管理 ────────────────────────────────

  const { isUnlocked, unlock } = useLicense()

  // ── 保存コールバック ─────────────────────────────

  const handleSaveChildren = useCallback((children: Child[]) => {
    const current = loadAppData()
    saveAppData({ ...current, children })
  }, [])

  const handleSaveFamilyInfo = useCallback((familyInfo: FamilyInfoType) => {
    const current = loadAppData()
    saveAppData({ ...current, familyInfo })
  }, [])

  const handleSaveTasks = useCallback((tasks: Task[]) => {
    const current = loadAppData()
    saveAppData({ ...current, tasks })
  }, [])

  const handleSaveHealth = useCallback(
    (data: {
      doctors: Doctor[]
      allergies: Allergy[]
      illnesses: Illness[]
      healthMemos: HealthMemo[]
      vaccineRecords: VaccineRecord[]
      customVaccines: CustomVaccine[]
      appointments: Appointment[]    // ステップ⑦追加
    }) => {
      const current = loadAppData()
      saveAppData({ ...current, ...data })
    },
    [],
  )

  // ── フック ───────────────────────────────────────

  const {
    children,
    activeChildId,
    setActiveChildId,
    addChild,
    deleteChild,
  } = useChildren(initialData.children, handleSaveChildren)

  const { familyInfo, updateFamilyInfo } = useFamilyInfo(
    initialData.familyInfo,
    handleSaveFamilyInfo,
  )

  const { tasks, addTask, toggleTask, deleteTask, getTasksByChildId } = useTasks(
    initialData.tasks,
    handleSaveTasks,
  )

  const {
    addDoctor,
    deleteDoctor,
    addAllergy,
    deleteAllergy,
    addIllness,
    deleteIllness,
    updateHealthMemo,
    upsertVaccineRecord,
    addCustomVaccine,
    deleteCustomVaccine,
    addAppointment,      // ステップ⑦追加
    deleteAppointment,   // ステップ⑦追加
    getHealthByChildId,
  } = useHealth(
    initialData.doctors,
    initialData.allergies,
    initialData.illnesses,
    initialData.healthMemos,
    initialData.vaccineRecords,
    initialData.customVaccines,
    initialData.appointments,   // ステップ⑦追加
    handleSaveHealth,
  )

  // ── 派生データ ───────────────────────────────────

  const activeChild = children.find((c) => c.id === activeChildId)
  const activeTasks = activeChildId ? getTasksByChildId(activeChildId) : []
  const activeHealth = activeChildId ? getHealthByChildId(activeChildId) : null

  // 全子供の予約（ScheduleView・TaskSummary用）
  const allAppointments = children.flatMap((c) => getHealthByChildId(c.id).appointments)
  // アクティブな子供の予約（TaskSummary用）
  const activeAppointments = activeHealth?.appointments ?? []

  // ── 子供追加ボタンのハンドラ ──────────────────────
  // デモ版かつ既に上限人数に達している場合は制限モーダルを表示
  const handleAddChildClick = () => {
    if (!isUnlocked && children.length >= FREE_CHILD_LIMIT) {
      setIsChildLimitModalOpen(true)
    } else {
      setIsChildModalOpen(true)
    }
  }

  return (
    <div className="min-h-screen bg-cream">
      {/* ヘッダー */}
      <Header />

      {/* ライセンスバナー（常時表示） */}
      <LicenseBanner
        isUnlocked={isUnlocked}
        onUnlockClick={() => setIsUnlockModalOpen(true)}
      />

      {/* バックアップリマインドバナー */}
      {showBackupReminder && (
        <div className="bg-amber-50 border-b border-amber-200">
          <div className="max-w-2xl mx-auto px-4 py-2 flex items-center justify-between gap-3">
            <p className="text-xs text-amber-700">
              💾 データのバックアップをお忘れなく！「家族の共通情報」からいつでも保存できます
            </p>
            <button
              onClick={() => {
                setShowBackupReminder(false)
                localStorage.setItem(BACKUP_LAST_KEY, String(Date.now()))
              }}
              className="flex-shrink-0 text-xs text-amber-600 font-medium underline underline-offset-2 hover:opacity-70"
            >
              閉じる
            </button>
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* 全子供の予定まとめ */}
        {children.length > 0 && (
          <ScheduleView
            children={children}
            tasks={tasks}
            appointments={allAppointments}
          />
        )}

        {/* 子供セクション */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-semibold text-rose-brown">子供の情報</h2>
            {children.length > 0 && (
              <button
                onClick={handleAddChildClick}
                className="flex items-center gap-1 text-sm bg-pink-muted text-cream px-3 py-1.5 rounded-full shadow hover:opacity-90 transition-opacity"
              >
                ＋ 子供を追加
              </button>
            )}
          </div>

          {children.length === 0 ? (
            // 1人目は常に無料
            <EmptyState onAdd={() => setIsChildModalOpen(true)} />
          ) : (
            <ChildTabs
              children={children}
              activeChildId={activeChildId}
              onTabChange={setActiveChildId}
              onAddChild={handleAddChildClick}
              onDeleteChild={deleteChild}
            />
          )}
        </section>

        {/* 子供が選択されているときのみ表示するセクション群 */}
        {activeChild && (
          <>
            {/* タスク・お知らせセクション（無料機能） */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-rose-brown">
                  タスク・お知らせ
                </h2>
                <button
                  onClick={() => setIsTaskModalOpen(true)}
                  className="flex items-center gap-1 text-sm bg-pink-muted text-cream px-3 py-1.5 rounded-full shadow hover:opacity-90 transition-opacity"
                >
                  <Plus size={14} />
                  タスクを追加
                </button>
              </div>
              <TaskSummary tasks={activeTasks} appointments={activeAppointments} />
              <TaskList
                tasks={activeTasks}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            </section>

            {/* 健康・医療情報セクション（基本2件まで無料・ワクチン記録は有料） */}
            <section>
              {activeHealth && (
                <HealthSection
                  health={activeHealth}
                  isUnlocked={isUnlocked}
                  onUnlockClick={() => setIsUnlockModalOpen(true)}
                  onAddDoctor={(v) => addDoctor(activeChild.id, v)}
                  onDeleteDoctor={deleteDoctor}
                  onAddAllergy={(v) => addAllergy(activeChild.id, v)}
                  onDeleteAllergy={deleteAllergy}
                  onAddIllness={(v) => addIllness(activeChild.id, v)}
                  onDeleteIllness={deleteIllness}
                  onSaveHealthMemo={(c) => updateHealthMemo(activeChild.id, c)}
                  onUpsertVaccineRecord={(
                    name: string,
                    type: VaccineType,
                    vd: string,
                    nd: string,
                    memo: string,
                  ) => upsertVaccineRecord(activeChild.id, name, type, vd, nd, memo)}
                  onAddCustomVaccine={(v) => addCustomVaccine(activeChild.id, v)}
                  onDeleteCustomVaccine={deleteCustomVaccine}
                  onAddAppointment={(v) => addAppointment(activeChild.id, v)}
                  onDeleteAppointment={deleteAppointment}
                />
              )}
            </section>

            {/* 提出用サマリーセクション（有料機能） */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-rose-brown">提出用サマリー</h2>
              </div>
              <LicenseGate
                isUnlocked={isUnlocked}
                onUnlockClick={() => setIsUnlockModalOpen(true)}
                featureName="提出用サマリー"
                featureDescription="子供の情報を1枚にまとめてコピーできます。学校・病院への提出に便利です"
              >
                {activeHealth && (
                  <SummarySection
                    child={activeChild}
                    allergies={activeHealth.allergies}
                    doctors={activeHealth.doctors}
                    illnesses={activeHealth.illnesses}
                    vaccineRecords={activeHealth.vaccineRecords}
                    customVaccines={activeHealth.customVaccines}
                    healthMemo={activeHealth.healthMemo}
                    familyInfo={familyInfo}
                  />
                )}
              </LicenseGate>
            </section>
          </>
        )}

        {/* 家族共通情報セクション */}
        <section>
          <FamilyInfo familyInfo={familyInfo} onSave={updateFamilyInfo} />
        </section>
      </main>

      {/* ── モーダル群 ── */}

      {/* 子供追加モーダル */}
      {isChildModalOpen && (
        <AddChildModal
          onClose={() => setIsChildModalOpen(false)}
          onAdd={addChild}
        />
      )}

      {/* タスク追加モーダル */}
      {isTaskModalOpen && activeChild && (
        <AddTaskModal
          childName={activeChild.name}
          onClose={() => setIsTaskModalOpen(false)}
          onAdd={(values) => addTask(activeChild.id, values)}
        />
      )}

      {/* 解除コード入力モーダル */}
      {isUnlockModalOpen && (
        <UnlockModal
          onClose={() => setIsUnlockModalOpen(false)}
          onUnlock={unlock}
        />
      )}

      {/* 子供追加制限モーダル */}
      {isChildLimitModalOpen && (
        <ChildLimitModal
          onClose={() => setIsChildLimitModalOpen(false)}
          onUnlockClick={() => setIsUnlockModalOpen(true)}
        />
      )}
    </div>
  )
}

export default App
