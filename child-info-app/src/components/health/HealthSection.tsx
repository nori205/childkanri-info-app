// ===========================
// 健康・医療情報セクション（コンテナ）
// ===========================

import { HeartPulse } from 'lucide-react'
import DoctorSection from './DoctorSection'
import AllergySection from './AllergySection'
import IllnessSection from './IllnessSection'
import HealthMemoSection from './HealthMemoSection'
import VaccineSection from './VaccineSection'
import type { ChildHealthData } from '../../hooks/useHealth'
import type { Doctor, Allergy, Illness, CustomVaccine, VaccineType } from '../../types'

interface HealthSectionProps {
  health: ChildHealthData
  onAddDoctor: (values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteDoctor: (id: string) => void
  onAddAllergy: (values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteAllergy: (id: string) => void
  onAddIllness: (values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteIllness: (id: string) => void
  onSaveHealthMemo: (content: string) => void
  // ワクチン（ステップ④追加）
  onUpsertVaccineRecord: (
    vaccineName: string,
    vaccineType: VaccineType,
    vaccinationDate: string,
    nextDate: string,
    memo: string,
  ) => void
  onAddCustomVaccine: (values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteCustomVaccine: (id: string) => void
}

const HealthSection = ({
  health,
  onAddDoctor,
  onDeleteDoctor,
  onAddAllergy,
  onDeleteAllergy,
  onAddIllness,
  onDeleteIllness,
  onSaveHealthMemo,
  onUpsertVaccineRecord,
  onAddCustomVaccine,
  onDeleteCustomVaccine,
}: HealthSectionProps) => {
  return (
    <section>
      {/* セクションタイトル */}
      <div className="flex items-center gap-2 mb-3">
        <HeartPulse size={17} className="text-rose-brown" />
        <h2 className="text-base font-semibold text-rose-brown">健康・医療情報</h2>
      </div>

      {/* 各アコーディオン */}
      <div className="space-y-3">
        <DoctorSection
          doctors={health.doctors}
          onAdd={onAddDoctor}
          onDelete={onDeleteDoctor}
        />
        <AllergySection
          allergies={health.allergies}
          onAdd={onAddAllergy}
          onDelete={onDeleteAllergy}
        />
        <IllnessSection
          illnesses={health.illnesses}
          onAdd={onAddIllness}
          onDelete={onDeleteIllness}
        />
        {/* ワクチン記録（ステップ④追加） */}
        <VaccineSection
          vaccineRecords={health.vaccineRecords}
          customVaccines={health.customVaccines}
          onUpsertRecord={onUpsertVaccineRecord}
          onAddCustom={onAddCustomVaccine}
          onDeleteCustom={onDeleteCustomVaccine}
        />
        <HealthMemoSection
          healthMemo={health.healthMemo}
          onSave={onSaveHealthMemo}
        />
      </div>
    </section>
  )
}

export default HealthSection
