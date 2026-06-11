import type { PersonalityId } from '../personalities'
import {
  DEVELOPER_DAILY_LIMIT,
  isDeveloperUnlocked,
} from '../dev/developerMode'

export const FREE_DAILY_LIMIT = 3
export const PRO_DAILY_LIMIT = 20

export const FREE_PERSONALITIES: PersonalityId[] = ['normal', 'salaryman']

const STORAGE_PRO = 'ai-meme-is-pro'
const STORAGE_COUNT = 'ai-meme-usage-count'
const STORAGE_DATE = 'ai-meme-usage-date'

export type UsageSnapshot = {
  isPro: boolean
  isDeveloper: boolean
  usedToday: number
  dailyLimit: number
  remaining: number
}

function developerUsageSnapshot(): UsageSnapshot {
  return {
    isPro: true,
    isDeveloper: true,
    usedToday: 0,
    dailyLimit: DEVELOPER_DAILY_LIMIT,
    remaining: DEVELOPER_DAILY_LIMIT,
  }
}

export function getTodayString(date = new Date()) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function getDailyLimit(isPro: boolean) {
  if (isDeveloperUnlocked()) return DEVELOPER_DAILY_LIMIT
  return isPro ? PRO_DAILY_LIMIT : FREE_DAILY_LIMIT
}

export function isPersonalityUnlocked(id: PersonalityId, isPro: boolean) {
  if (isDeveloperUnlocked()) return true
  if (isPro) return true
  return FREE_PERSONALITIES.includes(id)
}

function readIsPro() {
  return localStorage.getItem(STORAGE_PRO) === 'true'
}

function writeIsPro(isPro: boolean) {
  localStorage.setItem(STORAGE_PRO, isPro ? 'true' : 'false')
}

function resetCountIfNewDay(today: string) {
  const lastDate = localStorage.getItem(STORAGE_DATE)
  if (lastDate !== today) {
    localStorage.setItem(STORAGE_DATE, today)
    localStorage.setItem(STORAGE_COUNT, '0')
    return 0
  }
  return Number(localStorage.getItem(STORAGE_COUNT) ?? '0')
}

export function loadUsageSnapshot(): UsageSnapshot {
  if (isDeveloperUnlocked()) {
    return developerUsageSnapshot()
  }

  const today = getTodayString()
  const isPro = readIsPro()
  const usedToday = resetCountIfNewDay(today)
  const dailyLimit = getDailyLimit(isPro)
  const remaining = Math.max(0, dailyLimit - usedToday)

  return { isPro, isDeveloper: false, usedToday, dailyLimit, remaining }
}

export function consumeUsage(): UsageSnapshot {
  if (isDeveloperUnlocked()) {
    return developerUsageSnapshot()
  }

  const today = getTodayString()
  const isPro = readIsPro()
  const usedToday = resetCountIfNewDay(today) + 1
  localStorage.setItem(STORAGE_DATE, today)
  localStorage.setItem(STORAGE_COUNT, String(usedToday))

  const dailyLimit = getDailyLimit(isPro)
  return {
    isPro,
    isDeveloper: false,
    usedToday,
    dailyLimit,
    remaining: Math.max(0, dailyLimit - usedToday),
  }
}

export function toggleProMode(): UsageSnapshot {
  if (isDeveloperUnlocked()) {
    return developerUsageSnapshot()
  }

  const next = !readIsPro()
  writeIsPro(next)
  return loadUsageSnapshot()
}

export function setProMode(isPro: boolean): UsageSnapshot {
  if (isDeveloperUnlocked()) {
    return developerUsageSnapshot()
  }

  writeIsPro(isPro)
  return loadUsageSnapshot()
}

export function shouldShowUpgrade(): boolean {
  return !isDeveloperUnlocked()
}
