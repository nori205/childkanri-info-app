// ===========================
// 家族共通情報管理カスタムフック
// ===========================

import { useState, useCallback } from 'react'
import type { FamilyInfo } from '../types'

interface UseFamilyInfoReturn {
  familyInfo: FamilyInfo
  updateFamilyInfo: (values: Omit<FamilyInfo, 'updatedAt'>) => void
}

export const useFamilyInfo = (
  initialInfo: FamilyInfo,
  onSave: (info: FamilyInfo) => void,
): UseFamilyInfoReturn => {
  const [familyInfo, setFamilyInfo] = useState<FamilyInfo>(initialInfo)

  // 家族情報を更新・保存する
  const updateFamilyInfo = useCallback(
    (values: Omit<FamilyInfo, 'updatedAt'>) => {
      const updated: FamilyInfo = {
        ...values,
        updatedAt: new Date().toISOString(),
      }
      setFamilyInfo(updated)
      onSave(updated)
    },
    [onSave],
  )

  return { familyInfo, updateFamilyInfo }
}
