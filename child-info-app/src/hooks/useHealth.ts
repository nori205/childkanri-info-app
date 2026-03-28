// ===========================
// 健康・医療情報管理カスタムフック
// ===========================

import { useState, useCallback } from 'react'
import type {
  Doctor,
  Allergy,
  Illness,
  HealthMemo,
  VaccineRecord,
  VaccineDose,
  VaccineType,
  CustomVaccine,
  Appointment,
  WelfareProvider,
  WelfareConsultant,
  DiagnosisInfo,
} from '../types'

// 子供IDで絞り込んだ健康情報
export interface ChildHealthData {
  doctors: Doctor[]
  allergies: Allergy[]
  illnesses: Illness[]
  healthMemo: HealthMemo | null
  vaccineRecords: VaccineRecord[]
  customVaccines: CustomVaccine[]
  appointments: Appointment[]
  welfareProviders: WelfareProvider[]
  welfareConsultants: WelfareConsultant[]
  diagnosisInfo: DiagnosisInfo | null
}

// onSaveに渡すデータ型
interface HealthSaveData {
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
}

interface UseHealthReturn {
  addDoctor: (childId: string, values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => void
  deleteDoctor: (id: string) => void
  updateDoctor: (id: string, values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => void
  addAllergy: (childId: string, values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => void
  deleteAllergy: (id: string) => void
  updateAllergy: (id: string, values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => void
  addIllness: (childId: string, values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => void
  deleteIllness: (id: string) => void
  updateIllness: (id: string, values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => void
  updateHealthMemo: (childId: string, content: string) => void
  upsertVaccineRecord: (
    childId: string,
    vaccineName: string,
    vaccineType: VaccineType,
    vaccinationDate: string,
    nextDate: string,
    memo: string,
    doses: VaccineDose[],
  ) => void
  addCustomVaccine: (childId: string, values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => void
  deleteCustomVaccine: (id: string) => void
  addAppointment: (childId: string, values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => void
  deleteAppointment: (id: string) => void
  updateAppointment: (id: string, values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => void
  addWelfareProvider: (childId: string, values: Omit<WelfareProvider, 'id' | 'childId' | 'createdAt'>) => void
  deleteWelfareProvider: (id: string) => void
  updateWelfareProvider: (id: string, values: Omit<WelfareProvider, 'id' | 'childId' | 'createdAt'>) => void
  addWelfareConsultant: (childId: string, values: Omit<WelfareConsultant, 'id' | 'childId' | 'createdAt'>) => void
  deleteWelfareConsultant: (id: string) => void
  updateWelfareConsultant: (id: string, values: Omit<WelfareConsultant, 'id' | 'childId' | 'createdAt'>) => void
  upsertDiagnosisInfo: (childId: string, values: Omit<DiagnosisInfo, 'childId' | 'updatedAt'>) => void
  getHealthByChildId: (childId: string) => ChildHealthData
}

const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useHealth = (
  initialDoctors: Doctor[],
  initialAllergies: Allergy[],
  initialIllnesses: Illness[],
  initialHealthMemos: HealthMemo[],
  initialVaccineRecords: VaccineRecord[],
  initialCustomVaccines: CustomVaccine[],
  initialAppointments: Appointment[],
  initialWelfareProviders: WelfareProvider[],
  initialWelfareConsultants: WelfareConsultant[],
  initialDiagnosisInfos: DiagnosisInfo[],
  onSave: (data: HealthSaveData) => void,
): UseHealthReturn => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [allergies, setAllergies] = useState<Allergy[]>(initialAllergies)
  const [illnesses, setIllnesses] = useState<Illness[]>(initialIllnesses)
  const [healthMemos, setHealthMemos] = useState<HealthMemo[]>(initialHealthMemos)
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>(initialVaccineRecords)
  const [customVaccines, setCustomVaccines] = useState<CustomVaccine[]>(initialCustomVaccines)
  const [appointments, setAppointments] = useState<Appointment[]>(initialAppointments)
  const [welfareProviders, setWelfareProviders] = useState<WelfareProvider[]>(initialWelfareProviders)
  const [welfareConsultants, setWelfareConsultants] = useState<WelfareConsultant[]>(initialWelfareConsultants)
  const [diagnosisInfos, setDiagnosisInfos] = useState<DiagnosisInfo[]>(initialDiagnosisInfos)

  const save = useCallback((data: HealthSaveData) => { onSave(data) }, [onSave])

  // 全stateをまとめたスナップショット（save呼び出し用ヘルパー）
  const snap = (overrides: Partial<HealthSaveData>): HealthSaveData => ({
    doctors,
    allergies,
    illnesses,
    healthMemos,
    vaccineRecords,
    customVaccines,
    appointments,
    welfareProviders,
    welfareConsultants,
    diagnosisInfos,
    ...overrides,
  })

  // ── かかりつけ医 ──────────────────────

  const addDoctor = useCallback(
    (childId: string, values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => {
      const d = [...doctors, { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }]
      setDoctors(d)
      save(snap({ doctors: d }))
    },
    [doctors, save, snap],
  )

  const deleteDoctor = useCallback(
    (id: string) => {
      const d = doctors.filter((x) => x.id !== id)
      setDoctors(d)
      save(snap({ doctors: d }))
    },
    [doctors, save, snap],
  )

  const updateDoctor = useCallback(
    (id: string, values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => {
      const d = doctors.map((x) => x.id === id ? { ...x, ...values } : x)
      setDoctors(d)
      save(snap({ doctors: d }))
    },
    [doctors, save, snap],
  )

  // ── アレルギー ────────────────────────

  const addAllergy = useCallback(
    (childId: string, values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => {
      const a = [...allergies, { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }]
      setAllergies(a)
      save(snap({ allergies: a }))
    },
    [allergies, save, snap],
  )

  const deleteAllergy = useCallback(
    (id: string) => {
      const a = allergies.filter((x) => x.id !== id)
      setAllergies(a)
      save(snap({ allergies: a }))
    },
    [allergies, save, snap],
  )

  const updateAllergy = useCallback(
    (id: string, values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => {
      const a = allergies.map((x) => x.id === id ? { ...x, ...values } : x)
      setAllergies(a)
      save(snap({ allergies: a }))
    },
    [allergies, save, snap],
  )

  // ── 病気履歴 ──────────────────────────

  const addIllness = useCallback(
    (childId: string, values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => {
      const il = [...illnesses, { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }]
      setIllnesses(il)
      save(snap({ illnesses: il }))
    },
    [illnesses, save, snap],
  )

  const deleteIllness = useCallback(
    (id: string) => {
      const il = illnesses.filter((x) => x.id !== id)
      setIllnesses(il)
      save(snap({ illnesses: il }))
    },
    [illnesses, save, snap],
  )

  const updateIllness = useCallback(
    (id: string, values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => {
      const il = illnesses.map((x) => x.id === id ? { ...x, ...values } : x)
      setIllnesses(il)
      save(snap({ illnesses: il }))
    },
    [illnesses, save, snap],
  )

  // ── 気づきメモ ────────────────────────

  const updateHealthMemo = useCallback(
    (childId: string, content: string) => {
      const now = new Date().toISOString()
      const exists = healthMemos.find((m) => m.childId === childId)
      const hm = exists
        ? healthMemos.map((m) => m.childId === childId ? { ...m, content, updatedAt: now } : m)
        : [...healthMemos, { childId, content, updatedAt: now }]
      setHealthMemos(hm)
      save(snap({ healthMemos: hm }))
    },
    [healthMemos, save, snap],
  )

  // ── ワクチン記録 ──────────────────────

  const upsertVaccineRecord = useCallback(
    (childId: string, vaccineName: string, vaccineType: VaccineType, vaccinationDate: string, nextDate: string, memo: string, doses: VaccineDose[]) => {
      const now = new Date().toISOString()
      const exists = vaccineRecords.find((r) => r.childId === childId && r.vaccineName === vaccineName)
      const vr = exists
        ? vaccineRecords.map((r) =>
            r.childId === childId && r.vaccineName === vaccineName
              ? { ...r, vaccinationDate, nextDate, memo, doses, updatedAt: now }
              : r,
          )
        : [...vaccineRecords, { id: generateId(), childId, vaccineName, vaccineType, vaccinationDate, nextDate, memo, doses, updatedAt: now }]
      setVaccineRecords(vr)
      save(snap({ vaccineRecords: vr }))
    },
    [vaccineRecords, save, snap],
  )

  const addCustomVaccine = useCallback(
    (childId: string, values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => {
      const cv = [...customVaccines, { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }]
      setCustomVaccines(cv)
      save(snap({ customVaccines: cv }))
    },
    [customVaccines, save, snap],
  )

  const deleteCustomVaccine = useCallback(
    (id: string) => {
      const cv = customVaccines.filter((x) => x.id !== id)
      setCustomVaccines(cv)
      save(snap({ customVaccines: cv }))
    },
    [customVaccines, save, snap],
  )

  // ── 通院・予約管理 ────────────────────

  const addAppointment = useCallback(
    (childId: string, values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => {
      const ap = [...appointments, { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }]
      setAppointments(ap)
      save(snap({ appointments: ap }))
    },
    [appointments, save, snap],
  )

  const deleteAppointment = useCallback(
    (id: string) => {
      const ap = appointments.filter((x) => x.id !== id)
      setAppointments(ap)
      save(snap({ appointments: ap }))
    },
    [appointments, save, snap],
  )

  const updateAppointment = useCallback(
    (id: string, values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => {
      const ap = appointments.map((x) => x.id === id ? { ...x, ...values } : x)
      setAppointments(ap)
      save(snap({ appointments: ap }))
    },
    [appointments, save, snap],
  )

  // ── 福祉サービス事業者 ────────────────

  const addWelfareProvider = useCallback(
    (childId: string, values: Omit<WelfareProvider, 'id' | 'childId' | 'createdAt'>) => {
      const wp = [...welfareProviders, { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }]
      setWelfareProviders(wp)
      save(snap({ welfareProviders: wp }))
    },
    [welfareProviders, save, snap],
  )

  const deleteWelfareProvider = useCallback(
    (id: string) => {
      const wp = welfareProviders.filter((x) => x.id !== id)
      setWelfareProviders(wp)
      save(snap({ welfareProviders: wp }))
    },
    [welfareProviders, save, snap],
  )

  const updateWelfareProvider = useCallback(
    (id: string, values: Omit<WelfareProvider, 'id' | 'childId' | 'createdAt'>) => {
      const wp = welfareProviders.map((x) => x.id === id ? { ...x, ...values } : x)
      setWelfareProviders(wp)
      save(snap({ welfareProviders: wp }))
    },
    [welfareProviders, save, snap],
  )

  // ── 相談支援専門員 ────────────────────

  const addWelfareConsultant = useCallback(
    (childId: string, values: Omit<WelfareConsultant, 'id' | 'childId' | 'createdAt'>) => {
      const wc = [...welfareConsultants, { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }]
      setWelfareConsultants(wc)
      save(snap({ welfareConsultants: wc }))
    },
    [welfareConsultants, save, snap],
  )

  const deleteWelfareConsultant = useCallback(
    (id: string) => {
      const wc = welfareConsultants.filter((x) => x.id !== id)
      setWelfareConsultants(wc)
      save(snap({ welfareConsultants: wc }))
    },
    [welfareConsultants, save, snap],
  )

  const updateWelfareConsultant = useCallback(
    (id: string, values: Omit<WelfareConsultant, 'id' | 'childId' | 'createdAt'>) => {
      const wc = welfareConsultants.map((x) => x.id === id ? { ...x, ...values } : x)
      setWelfareConsultants(wc)
      save(snap({ welfareConsultants: wc }))
    },
    [welfareConsultants, save, snap],
  )

  // ── 診断名・手帳 ──────────────────────

  const upsertDiagnosisInfo = useCallback(
    (childId: string, values: Omit<DiagnosisInfo, 'childId' | 'updatedAt'>) => {
      const now = new Date().toISOString()
      const exists = diagnosisInfos.find((d) => d.childId === childId)
      const di = exists
        ? diagnosisInfos.map((d) => d.childId === childId ? { ...d, ...values, updatedAt: now } : d)
        : [...diagnosisInfos, { childId, ...values, updatedAt: now }]
      setDiagnosisInfos(di)
      save(snap({ diagnosisInfos: di }))
    },
    [diagnosisInfos, save, snap],
  )

  // ── 子供IDで絞り込み ──────────────────

  const getHealthByChildId = useCallback(
    (childId: string): ChildHealthData => ({
      doctors: doctors.filter((d) => d.childId === childId),
      allergies: allergies.filter((a) => a.childId === childId),
      illnesses: illnesses
        .filter((il) => il.childId === childId)
        .sort((a, b) => b.onsetDate.localeCompare(a.onsetDate)),
      healthMemo: healthMemos.find((m) => m.childId === childId) ?? null,
      vaccineRecords: vaccineRecords.filter((r) => r.childId === childId),
      customVaccines: customVaccines.filter((cv) => cv.childId === childId),
      appointments: appointments
        .filter((ap) => ap.childId === childId)
        .sort((a, b) => a.date.localeCompare(b.date)),
      welfareProviders: welfareProviders.filter((wp) => wp.childId === childId),
      welfareConsultants: welfareConsultants.filter((wc) => wc.childId === childId),
      diagnosisInfo: diagnosisInfos.find((d) => d.childId === childId) ?? null,
    }),
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, appointments, welfareProviders, welfareConsultants, diagnosisInfos],
  )

  return {
    addDoctor, deleteDoctor, updateDoctor,
    addAllergy, deleteAllergy, updateAllergy,
    addIllness, deleteIllness, updateIllness,
    updateHealthMemo,
    upsertVaccineRecord,
    addCustomVaccine, deleteCustomVaccine,
    addAppointment, deleteAppointment, updateAppointment,
    addWelfareProvider, deleteWelfareProvider, updateWelfareProvider,
    addWelfareConsultant, deleteWelfareConsultant, updateWelfareConsultant,
    upsertDiagnosisInfo,
    getHealthByChildId,
  }
}
