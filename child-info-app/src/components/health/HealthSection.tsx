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
import WelfareSection from './WelfareSection'
import LicenseGate from '../LicenseGate'
import type { ChildHealthData } from '../../hooks/useHealth'
import type {
  Doctor, Allergy, Illness, CustomVaccine, VaccineType, Appointment,
  WelfareProvider, WelfareConsultant, DiagnosisInfo,
} from '../../types'

interface HealthSectionProps {
  health: ChildHealthData
  isUnlocked: boolean
  onUnlockClick: () => void
  onAddDoctor: (values: Omit<Doctor, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteDoctor: (id: string) => void
  onAddAllergy: (values: Omit<Allergy, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteAllergy: (id: string) => void
  onAddIllness: (values: Omit<Illness, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteIllness: (id: string) => void
  onSaveHealthMemo: (content: string) => void
  onUpsertVaccineRecord: (
    vaccineName: string, vaccineType: VaccineType,
    vaccinationDate: string, nextDate: string, memo: string,
  ) => void
  onAddCustomVaccine: (values: Omit<CustomVaccine, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteCustomVaccine: (id: string) => void
  onAddAppointment: (values: Omit<Appointment, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteAppointment: (id: string) => void
  onAddWelfareProvider: (values: Omit<WelfareProvider, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteWelfareProvider: (id: string) => void
  onAddWelfareConsultant: (values: Omit<WelfareConsultant, 'id' | 'childId' | 'createdAt'>) => void
  onDeleteWelfareConsultant: (id: string) => void
  onUpsertDiagnosis: (values: Omit<DiagnosisInfo, 'childId' | 'updatedAt'>) => void
}

const HealthSection = ({
  health, isUnlocked, onUnlockClick,
  onAddDoctor, onDeleteDoctor,
  onAddAllergy, onDeleteAllergy,
  onAddIllness, onDeleteIllness,
  onSaveHealthMemo,
  onUpsertVaccineRecord, onAddCustomVaccine, onDeleteCustomVaccine,
  onAddAppointment, onDeleteAppointment,
  onAddWelfareProvider, onDeleteWelfareProvider,
  onAddWelfareConsultant, onDeleteWelfareConsultant,
  onUpsertDiagnosis,
}: HealthSectionProps) => {
  return (
    <section>
      <div className="flex items-center gap-2 mb-3">
        <HeartPulse size={17} className="text-rose-brown" />
        <h2 className="text-base font-semibold text-rose-brown">健康・医療情報</h2>
      </div>

      <div className="space-y-3">
        {/* 通院予約（上部） */}
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
              locationSuggestions={health.doctors.map((d) => d.hospitalName).filter(Boolean)}
            />

            {/* かかりつけ医 */}
            <DoctorSection
              doctors={health.doctors}
              onAdd={onAddDoctor}
              onDelete={onDeleteDoctor}
              isUnlocked={isUnlocked}
              onUnlockClick={onUnlockClick}
            />

            {/* 病歴 */}
            <IllnessSection
              illnesses={health.illnesses}
              onAdd={onAddIllness}
              onDelete={onDeleteIllness}
            />

            {/* アレルギー */}
            <AllergySection
              allergies={health.allergies}
              onAdd={onAddAllergy}
              onDelete={onDeleteAllergy}
            />

            {/* ワクチン */}
            <VaccineSection
              vaccineRecords={health.vaccineRecords}
              customVaccines={health.customVaccines}
              onUpsertRecord={onUpsertVaccineRecord}
              onAddCustom={onAddCustomVaccine}
              onDeleteCustom={onDeleteCustomVaccine}
            />

            {/* 福祉サービス・診断情報 */}
            <WelfareSection
              welfareProviders={health.welfareProviders}
              welfareConsultants={health.welfareConsultants}
              diagnosisInfo={health.diagnosisInfo}
              onAddProvider={onAddWelfareProvider}
              onDeleteProvider={onDeleteWelfareProvider}
              onAddConsultant={onAddWelfareConsultant}
              onDeleteConsultant={onDeleteWelfareConsultant}
              onUpsertDiagnosis={onUpsertDiagnosis}
            />

            {/* メモ */}
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
