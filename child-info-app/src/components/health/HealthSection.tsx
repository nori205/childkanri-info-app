// ===========================
// 健康・医療情報セクション（コンテナ）
// ===========================

import { HeartPulse } from 'lucide-react'
import DoctorSection from './DoctorSection'
import AllergySection from './AllergySection'
import IllnessSection from './IllnessSection'
import HealthMemoSection from './HealthMemoSection'
import VaccineSection from './VaccineSection'
import AppointmentSection from './AppointmentSection'
import LicenseGate from '../LicenseGate'
import type { ChildHealthData } from '../../hooks/useHealth'
import type { Doctor, Allergy, Illness, CustomVaccine, VaccineType, Appointment } from '../../types'

interface HealthSectionProps {
  health: ChildHealthData
  // 無料・有料の制御
  isUnlocked: boolean
  onUnlockClick: () => void
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
  // 通院・予約管理（ステップ⑦追加）
  onAddAppointment: (values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteAppointment: (id: string) => void
}

const HealthSection = ({
  health,
  isUnlocked,
  onUnlockClick,
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
  onAddAppointment,
  onDeleteAppointment,
}: HealthSectionProps) => {
  return (
    <section>
      {/* セクションタイトル */}
      <div className="flex items-center gap-2 mb-3">
        <HeartPulse size={17} className="text-rose-brown" />
        <h2 className="text-base font-semibold text-rose-brown">健康・医療情報</h2>
      </div>

      <div className="space-y-3">
        {/* かかりつけ医：2件まで無料 */}
        <DoctorSection
          doctors={health.doctors}
          onAdd={onAddDoctor}
          onDelete={onDeleteDoctor}
          isUnlocked={isUnlocked}
          onUnlockClick={onUnlockClick}
        />

        {/* 以下は有料機能（LicenseGateで囲む） */}
        <LicenseGate
          isUnlocked={isUnlocked}
          onUnlockClick={onUnlockClick}
          featureName="通院・予約管理・アレルギー・病気履歴・ワクチン記録"
          featureDescription="解除するとすべての健康・医療情報を記録できます"
        >
          <div className="space-y-3">
            <AppointmentSection
              appointments={health.appointments}
              onAdd={onAddAppointment}
              onDelete={onDeleteAppointment}
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
        </LicenseGate>
      </div>
    </section>
  )
}

export default HealthSection
