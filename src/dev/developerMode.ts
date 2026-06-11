const STORAGE_DEVELOPER = 'developer_unlocked'

/** SHA-256 of developer passphrase — plaintext is not stored in source */
const DEVELOPER_CODE_HASH =
  '18b1ec0a148082433bb4900587197a0c3bc0d1c427e9048c31f9b24a1a0871c0'

export const DEVELOPER_DAILY_LIMIT = 999_999

async function sha256Hex(text: string): Promise<string> {
  const data = new TextEncoder().encode(text)
  const buffer = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(buffer))
    .map((byte) => byte.toString(16).padStart(2, '0'))
    .join('')
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

export async function verifyDeveloperCode(input: string): Promise<boolean> {
  const trimmed = input.trim()
  if (!trimmed) return false
  const hash = await sha256Hex(trimmed)
  return hash === DEVELOPER_CODE_HASH
}
