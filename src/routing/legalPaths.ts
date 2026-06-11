const DEFAULT_SITE_ORIGIN = 'https://ai-meme-app.vercel.app'

export const PRIVACY_PATH = '/privacy'
export const TERMS_PATH = '/terms'

export type LegalPage = 'privacy' | 'terms'

function siteOrigin(): string {
  const configured = import.meta.env.VITE_SITE_ORIGIN?.trim()
  if (configured) return configured.replace(/\/$/, '')
  if (typeof window !== 'undefined' && window.location.origin) {
    return window.location.origin
  }
  return DEFAULT_SITE_ORIGIN
}

export function getPrivacyPath(): string {
  return PRIVACY_PATH
}

export function getTermsPath(): string {
  return TERMS_PATH
}

export function getPrivacyUrl(): string {
  return `${siteOrigin()}${PRIVACY_PATH}`
}

export function getTermsUrl(): string {
  return `${siteOrigin()}${TERMS_PATH}`
}

export function getLegalPageFromPath(pathname: string): LegalPage | null {
  const normalized = pathname.replace(/\/$/, '') || '/'
  if (normalized === PRIVACY_PATH) return 'privacy'
  if (normalized === TERMS_PATH) return 'terms'
  return null
}
