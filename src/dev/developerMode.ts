import { sha256Hex } from './sha256'

const STORAGE_DEVELOPER = 'developer_unlocked'

/** SHA-256 of developer passphrase — plaintext is not stored in source */
const DEVELOPER_CODE_HASH =
  '18b1ec0a148082433bb4900587197a0c3bc0d1c427e9048c31f9b24a1a0871c0'

export const DEVELOPER_DAILY_LIMIT = 999_999

function normalizeDeveloperInput(input: string): string {
  return input
    .trim()
    .replace(/[\u200B-\u200D\uFEFF]/g, '')
    .normalize('NFKC')
}

export function isDeveloperUnlocked(): boolean {
  try {
    return localStorage.getItem(STORAGE_DEVELOPER) === 'true'
  } catch {
    return false
  }
}

export function unlockDeveloperMode(): void {
  try {
    localStorage.setItem(STORAGE_DEVELOPER, 'true')
  } catch {
    // ignore
  }
}

export function verifyDeveloperCode(input: string): boolean {
  const normalized = normalizeDeveloperInput(input)
  if (!normalized) return false
  return sha256Hex(normalized) === DEVELOPER_CODE_HASH
}
