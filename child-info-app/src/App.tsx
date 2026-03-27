// ===========================
// アプリのルートコンポーネント
// ===========================

import { useState, useCallback } from 'react'
import { Plus, Trash2, Pencil } from 'lucide-react'
import Header from './components/Header'
import ChildTabs from './components/ChildTabs'
import ChildCard from './components/ChildCard'
import EmptyState from './components/EmptyState'
import AddChildModal from './components/AddChildModal'
import AddTaskModal from './components/AddTaskModal'
import TaskSummary from './components/TaskSummary'
import ScheduleView from './components/ScheduleView'
import TaskList from './components/TaskList'
import FamilyInfo from './components/FamilyInfo'
import HealthSection from './components/health/HealthSection'
import SummarySection from './components/SummarySection'
import BackupSection from './components/BackupSection'
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
  WelfareProvider,
  WelfareConsultant,
  DiagnosisInfo,
} from './types'
import { STORAGE_KEY, DATA_VERSION, DEFAULT_FAMILY_INFO, FREE_CHILD_LIMIT } from './constants'
import type { FamilyMember } from './types'

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
      appointments: data.appointments ?? [],
      welfareProviders: data.welfareProviders ?? [],
      welfareConsultants: data.welfareConsultants ?? [],
      diagnosisInfos: data.diagnosisInfos ?? [],
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
      appointments: [],
      welfareProviders: [],
      welfareConsultants: [],
      diagnosisInfos: [],
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
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)
  // 子供削除確認（ChildCard下部の削除ボタン用）
  const [confirmDeleteChildId, setConfirmDeleteChildId] = useState<string | null>(null)
  // 子供情報編集モーダル
  const [isEditChildModalOpen, setIsEditChildModalOpen] = useState(false)
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
      appointments: Appointment[]
      welfareProviders: WelfareProvider[]
      welfareConsultants: WelfareConsultant[]
      diagnosisInfos: DiagnosisInfo[]
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
    updateChild,
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
    addDoctor, deleteDoctor,
    addAllergy, deleteAllergy,
    addIllness, deleteIllness,
    updateHealthMemo,
    upsertVaccineRecord,
    addCustomVaccine, deleteCustomVaccine,
    addAppointment, deleteAppointment,
    addWelfareProvider, deleteWelfareProvider,
    addWelfareConsultant, deleteWelfareConsultant,
    upsertDiagnosisInfo,
    getHealthByChildId,
  } = useHealth(
    initialData.doctors,
    initialData.allergies,
    initialData.illnesses,
    initialData.healthMemos,
    initialData.vaccineRecords,
    initialData.customVaccines,
    initialData.appointments,
    initialData.welfareProviders,
    initialData.welfareConsultants,
    initialData.diagnosisInfos,
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

      {/* メインコンテンツ */}
      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">

        {/* ① バックアップ・復元（一番上） */}
        <BackupSection />

        {/* ② 全子供の予定まとめ（2週間） */}
        {children.length > 0 && (
          <ScheduleView
            children={children}
            tasks={tasks}
            appointments={allAppointments}
          />
        )}

        {/* ③ 子供タブ（名前切り替えのみ・カード非表示） */}
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
            <EmptyState onAdd={() => setIsChildModalOpen(true)} />
          ) : (
            <ChildTabs
              children={children}
              activeChildId={activeChildId}
              onTabChange={setActiveChildId}
              onAddChild={handleAddChildClick}
              onDeleteChild={deleteChild}
              showCard={false}
            />
          )}
        </section>

        {/* 子供が選択されているときのみ表示するセクション群 */}
        {activeChild && (
          <>
            {/* ④ タスク・お知らせ */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-rose-brown">タスク・お知らせ</h2>
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

            {/* ⑤ 健康・医療情報（通院予約→病歴→アレルギー→ワクチン→メモ→かかりつけ医） */}
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
                  onAddWelfareProvider={(v) => addWelfareProvider(activeChild.id, v)}
                  onDeleteWelfareProvider={deleteWelfareProvider}
                  onAddWelfareConsultant={(v) => addWelfareConsultant(activeChild.id, v)}
                  onDeleteWelfareConsultant={deleteWelfareConsultant}
                  onUpsertDiagnosis={(v) => upsertDiagnosisInfo(activeChild.id, v)}
                />
              )}
            </section>

            {/* ⑥ 家族共通情報 */}
            <section>
              <FamilyInfo familyInfo={familyInfo} onSave={updateFamilyInfo} />
            </section>

            {/* ⑦ 子供の基本情報（名前・学校名など） */}
            <section>
              <h2 className="text-base font-semibold text-rose-brown mb-3">基本情報</h2>
              <ChildCard child={activeChild} />
              <div className="mt-3 flex justify-between">
                <button
                  onClick={() => setIsEditChildModalOpen(true)}
                  className="flex items-center gap-1.5 text-sm text-rose-brown hover:text-dark-brown transition-colors px-3 py-1.5 rounded-lg hover:bg-pink-soft/40"
                >
                  <Pencil size={15} />
                  情報を編集
                </button>
                <button
                  onClick={() => setConfirmDeleteChildId(activeChild.id)}
                  className="flex items-center gap-1.5 text-sm text-rose-brown hover:text-dark-brown transition-colors px-3 py-1.5 rounded-lg hover:bg-pink-soft/40"
                >
                  <Trash2 size={15} />
                  この子を削除
                </button>
              </div>
            </section>

            {/* ⑧ プリントして保管（提出用サマリー・有料機能・一番下） */}
            <section>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-base font-semibold text-rose-brown">プリントして保管はここから</h2>
              </div>
              <LicenseGate
                isUnlocked={isUnlocked}
                onUnlockClick={() => setIsUnlockModalOpen(true)}
                featureName="プリントして保管"
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
      </main>

      {/* 子供削除確認ダイアログ */}
      {confirmDeleteChildId && (
        <div
          className="fixed inset-0 bg-dark-brown/40 flex items-center justify-center z-50 px-4"
          onClick={(e) => e.target === e.currentTarget && setConfirmDeleteChildId(null)}
        >
          <div className="bg-cream rounded-2xl shadow-xl w-full max-w-sm p-6">
            <h3 className="text-lg font-bold text-dark-brown mb-2">本当に削除しますか？</h3>
            <p className="text-sm text-rose-brown mb-6">
              「{children.find((c) => c.id === confirmDeleteChildId)?.name}」の情報をすべて削除します。この操作は元に戻せません。
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmDeleteChildId(null)}
                className="flex-1 border border-pink-soft text-rose-brown py-2.5 rounded-xl font-medium hover:bg-pink-soft/30 transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={() => { deleteChild(confirmDeleteChildId); setConfirmDeleteChildId(null) }}
                className="flex-1 bg-rose-brown text-cream py-2.5 rounded-xl font-medium shadow hover:opacity-90 transition-opacity"
              >
                削除する
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── モーダル群 ── */}

      {/* 子供追加モーダル */}
      {isChildModalOpen && (
        <AddChildModal
          onClose={() => setIsChildModalOpen(false)}
          onAdd={addChild}
        />
      )}

      {/* 子供情報編集モーダル */}
      {isEditChildModalOpen && activeChild && (
        <AddChildModal
          onClose={() => setIsEditChildModalOpen(false)}
          onAdd={addChild}
          editInitialValues={{
            name: activeChild.name,
            birthDate: activeChild.birthDate,
            birthHeight: activeChild.birthHeight ?? '',
            birthWeight: activeChild.birthWeight ?? '',
            grade: activeChild.grade,
            schoolName: activeChild.schoolName,
            bloodType: activeChild.bloodType,
            height: activeChild.height,
            weight: activeChild.weight,
          }}
          onEdit={(values) => updateChild(activeChild.id, values)}
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
