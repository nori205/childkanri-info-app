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
  VaccineType,
  CustomVaccine,
} from '../types'

// 子供IDで絞り込んだ健康情報
export interface ChildHealthData {
  doctors: Doctor[]
  allergies: Allergy[]
  illnesses: Illness[]
  healthMemo: HealthMemo | null
  vaccineRecords: VaccineRecord[]    // ステップ④追加
  customVaccines: CustomVaccine[]    // ステップ④追加
}

// onSaveに渡すデータ型
interface HealthSaveData {
  doctors: Doctor[]
  allergies: Allergy[]
  illnesses: Illness[]
  healthMemos: HealthMemo[]
  vaccineRecords: VaccineRecord[]
  customVaccines: CustomVaccine[]
}

interface UseHealthReturn {
  addDoctor: (childId: string, values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => void
  deleteDoctor: (id: string) => void
  addAllergy: (childId: string, values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => void
  deleteAllergy: (id: string) => void
  addIllness: (childId: string, values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => void
  deleteIllness: (id: string) => void
  updateHealthMemo: (childId: string, content: string) => void
  // ワクチン（ステップ④追加）
  upsertVaccineRecord: (
    childId: string,
    vaccineName: string,
    vaccineType: VaccineType,
    vaccinationDate: string,
    nextDate: string,
    memo: string,
  ) => void
  addCustomVaccine: (childId: string, values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => void
  deleteCustomVaccine: (id: string) => void
  getHealthByChildId: (childId: string) => ChildHealthData
}

// UUIDを簡易生成
const generateId = (): string =>
  `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`

export const useHealth = (
  initialDoctors: Doctor[],
  initialAllergies: Allergy[],
  initialIllnesses: Illness[],
  initialHealthMemos: HealthMemo[],
  initialVaccineRecords: VaccineRecord[],
  initialCustomVaccines: CustomVaccine[],
  onSave: (data: HealthSaveData) => void,
): UseHealthReturn => {
  const [doctors, setDoctors] = useState<Doctor[]>(initialDoctors)
  const [allergies, setAllergies] = useState<Allergy[]>(initialAllergies)
  const [illnesses, setIllnesses] = useState<Illness[]>(initialIllnesses)
  const [healthMemos, setHealthMemos] = useState<HealthMemo[]>(initialHealthMemos)
  const [vaccineRecords, setVaccineRecords] = useState<VaccineRecord[]>(initialVaccineRecords)
  const [customVaccines, setCustomVaccines] = useState<CustomVaccine[]>(initialCustomVaccines)

  // 保存ヘルパー（全stateをまとめてonSaveへ渡す）
  const save = useCallback(
    (data: HealthSaveData) => { onSave(data) },
    [onSave],
  )

  // ── かかりつけ医 ──────────────────────

  const addDoctor = useCallback(
    (childId: string, values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => {
      const next: Doctor = { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }
      const d = [...doctors, next]
      setDoctors(d)
      save({ doctors: d, allergies, illnesses, healthMemos, vaccineRecords, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  const deleteDoctor = useCallback(
    (id: string) => {
      const d = doctors.filter((x) => x.id !== id)
      setDoctors(d)
      save({ doctors: d, allergies, illnesses, healthMemos, vaccineRecords, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  // ── アレルギー ────────────────────────

  const addAllergy = useCallback(
    (childId: string, values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => {
      const next: Allergy = { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }
      const a = [...allergies, next]
      setAllergies(a)
      save({ doctors, allergies: a, illnesses, healthMemos, vaccineRecords, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  const deleteAllergy = useCallback(
    (id: string) => {
      const a = allergies.filter((x) => x.id !== id)
      setAllergies(a)
      save({ doctors, allergies: a, illnesses, healthMemos, vaccineRecords, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  // ── 病気履歴 ──────────────────────────

  const addIllness = useCallback(
    (childId: string, values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => {
      const next: Illness = { id: generateId(), childId, ...values, createdAt: new Date().toISOString() }
      const il = [...illnesses, next]
      setIllnesses(il)
      save({ doctors, allergies, illnesses: il, healthMemos, vaccineRecords, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  const deleteIllness = useCallback(
    (id: string) => {
      const il = illnesses.filter((x) => x.id !== id)
      setIllnesses(il)
      save({ doctors, allergies, illnesses: il, healthMemos, vaccineRecords, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
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
      save({ doctors, allergies, illnesses, healthMemos: hm, vaccineRecords, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  // ── ワクチン記録（ステップ④） ─────────

  // 定期・任意ワクチンの記録をアップサート（childId × vaccineName で一意）
  const upsertVaccineRecord = useCallback(
    (
      childId: string,
      vaccineName: string,
      vaccineType: VaccineType,
      vaccinationDate: string,
      nextDate: string,
      memo: string,
    ) => {
      const now = new Date().toISOString()
      const exists = vaccineRecords.find(
        (r) => r.childId === childId && r.vaccineName === vaccineName,
      )
      const vr = exists
        ? vaccineRecords.map((r) =>
            r.childId === childId && r.vaccineName === vaccineName
              ? { ...r, vaccinationDate, nextDate, memo, updatedAt: now }
              : r,
          )
        : [
            ...vaccineRecords,
            {
              id: generateId(),
              childId,
              vaccineName,
              vaccineType,
              vaccinationDate,
              nextDate,
              memo,
              updatedAt: now,
            },
          ]
      setVaccineRecords(vr)
      save({ doctors, allergies, illnesses, healthMemos, vaccineRecords: vr, customVaccines })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  // 個別ワクチンを追加する
  const addCustomVaccine = useCallback(
    (childId: string, values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => {
      const next: CustomVaccine = {
        id: generateId(),
        childId,
        ...values,
        createdAt: new Date().toISOString(),
      }
      const cv = [...customVaccines, next]
      setCustomVaccines(cv)
      save({ doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines: cv })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
  )

  // 個別ワクチンを削除する
  const deleteCustomVaccine = useCallback(
    (id: string) => {
      const cv = customVaccines.filter((x) => x.id !== id)
      setCustomVaccines(cv)
      save({ doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines: cv })
    },
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines, save],
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
    }),
    [doctors, allergies, illnesses, healthMemos, vaccineRecords, customVaccines],
  )

  return {
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
    getHealthByChildId,
  }
}
