import { isNativeApp } from '../platform/runtime'

const DEFAULT_PRODUCTION_API_ORIGIN = 'https://ai-meme-app.vercel.app'

function configuredApiOrigin(): string | null {
  const value = import.meta.env.VITE_API_BASE_URL?.trim()
  if (!value) return null
  return value.replace(/\/$/, '')
}

export function getAnalyzeApiUrl(): string {
  const configured = configuredApiOrigin()
  if (configured) {
    return `${configured}/api/analyze`
  }

  if (isNativeApp()) {
    return `${DEFAULT_PRODUCTION_API_ORIGIN}/api/analyze`
  }

  return '/api/analyze'
}
