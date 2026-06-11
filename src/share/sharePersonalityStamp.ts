import type { PersonalityId } from '../personalities'

export type PersonalityStampConfig = {
  main: string
  sub?: string
  /** 蓋章旋轉角度（-8 ~ 8deg） */
  rotation: number
}

export const PERSONALITY_STAMPS: Record<PersonalityId, PersonalityStampConfig> = {
  ancient: { main: '玉璽', sub: '奉旨', rotation: -8 },
  hell: { main: '故障警告', sub: 'DANGER', rotation: 7 },
  hellspicy: { main: '加辣警告', sub: 'SPICY', rotation: -8 },
  salaryman: { main: 'KPI 核准', sub: 'APPROVED', rotation: 5 },
  zen: { main: '阿彌陀佛', rotation: 4 },
  guilt: { main: '內疚認證', rotation: -7 },
  lovebrain: { main: '暈船核准', sub: 'LOVE', rotation: -5 },
  normal: { main: 'AI 已判定', sub: 'VERIFIED', rotation: -6 },
}

export function getPersonalityStamp(personalityId: PersonalityId): PersonalityStampConfig {
  return PERSONALITY_STAMPS[personalityId]
}
