import type { PersonalityId } from './personalities'
import { PERSONALITY_DISCLAIMERS } from './personalities'

export type ProfessionalMetric = {
  label: string
  value: number
}

export type DangerLevel = {
  label: string
  tone: 'safe' | 'warning' | 'high' | 'sleep' | 'giveup'
}

export type ReportExtras = {
  reportId: string
  reportDate: string
  professionalMetrics: ProfessionalMetric[]
  dangerLevel: DangerLevel
  disclaimer: string
  radarValues: number[]
}

const METRIC_POOL = [
  { label: '戀愛腦指數', min: 52, max: 99 },
  { label: '理智剩餘', min: 2, max: 28 },
  { label: '衝動係數', min: 58, max: 98 },
  { label: '社死風險', min: 61, max: 99 },
  { label: '財務危機值', min: 44, max: 96 },
  { label: '暈船機率', min: 49, max: 97 },
] as const

const DANGER_LEVELS: DangerLevel[] = [
  { label: '安全', tone: 'safe' },
  { label: '危險', tone: 'warning' },
  { label: '極度危險', tone: 'high' },
  { label: '建議直接睡覺', tone: 'sleep' },
  { label: 'AI 放棄治療', tone: 'giveup' },
]

function pickDisclaimer(personalityId: PersonalityId) {
  const pool = PERSONALITY_DISCLAIMERS[personalityId]
  return pool[Math.floor(Math.random() * pool.length)]
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pickRandom<T>(items: readonly T[], count: number): T[] {
  const pool = [...items]
  const picked: T[] = []

  for (let i = 0; i < count && pool.length > 0; i += 1) {
    const index = Math.floor(Math.random() * pool.length)
    picked.push(pool.splice(index, 1)[0])
  }

  return picked
}

function formatReportDate(date: Date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}.${m}.${d}`
}

export function buildReportExtras(
  personalityId: PersonalityId = 'normal',
): ReportExtras {
  const metrics = pickRandom(METRIC_POOL, 3).map((item) => ({
    label: item.label,
    value: randomInt(item.min, item.max),
  }))

  return {
    reportId: `QX-${randomInt(1000000, 9999999)}`,
    reportDate: formatReportDate(new Date()),
    professionalMetrics: metrics,
    dangerLevel:
      DANGER_LEVELS[Math.floor(Math.random() * DANGER_LEVELS.length)],
    disclaimer: pickDisclaimer(personalityId),
    radarValues: Array.from({ length: 5 }, () => randomInt(35, 95)),
  }
}
