import type { PersonalityId } from '../personalities'

export type ShareBrandTheme = {
  accent: string
  accentDim: string
  accentSoft: string
  accentGlow: string
  accentBg: string
  memeTag: string
}

export const SHARE_BRAND: Record<PersonalityId, ShareBrandTheme> = {
  normal: {
    accent: '#66ffcc',
    accentDim: 'rgba(102, 255, 204, 0.65)',
    accentSoft: 'rgba(102, 255, 204, 0.28)',
    accentGlow: 'rgba(102, 255, 204, 0.5)',
    accentBg: 'rgba(102, 255, 204, 0.1)',
    memeTag: '量子嘴砲',
  },
  hell: {
    accent: '#ff6b6b',
    accentDim: 'rgba(255, 107, 107, 0.7)',
    accentSoft: 'rgba(255, 107, 107, 0.3)',
    accentGlow: 'rgba(255, 107, 107, 0.5)',
    accentBg: 'rgba(255, 107, 107, 0.12)',
    memeTag: '地獄判定',
  },
  hellspicy: {
    accent: '#ff4444',
    accentDim: 'rgba(255, 68, 68, 0.75)',
    accentSoft: 'rgba(255, 68, 68, 0.32)',
    accentGlow: 'rgba(255, 100, 50, 0.55)',
    accentBg: 'rgba(255, 68, 68, 0.14)',
    memeTag: '加辣嘴你',
  },
  salaryman: {
    accent: '#fbbf24',
    accentDim: 'rgba(251, 191, 36, 0.75)',
    accentSoft: 'rgba(251, 191, 36, 0.3)',
    accentGlow: 'rgba(251, 191, 36, 0.45)',
    accentBg: 'rgba(251, 191, 36, 0.12)',
    memeTag: '社畜審判',
  },
  lovebrain: {
    accent: '#ff85b3',
    accentDim: 'rgba(255, 133, 179, 0.7)',
    accentSoft: 'rgba(255, 133, 179, 0.3)',
    accentGlow: 'rgba(255, 133, 179, 0.5)',
    accentBg: 'rgba(255, 133, 179, 0.12)',
    memeTag: '戀愛腦掃描',
  },
  zen: {
    accent: '#e8e4d4',
    accentDim: 'rgba(232, 228, 212, 0.75)',
    accentSoft: 'rgba(232, 228, 212, 0.28)',
    accentGlow: 'rgba(232, 228, 212, 0.4)',
    accentBg: 'rgba(232, 228, 212, 0.1)',
    memeTag: '隨緣看破',
  },
  guilt: {
    accent: '#c084fc',
    accentDim: 'rgba(192, 132, 252, 0.75)',
    accentSoft: 'rgba(192, 132, 252, 0.3)',
    accentGlow: 'rgba(192, 132, 252, 0.5)',
    accentBg: 'rgba(192, 132, 252, 0.12)',
    memeTag: '情勒關心',
  },
}

export function getShareBrandStyle(
  personalityId: PersonalityId,
): Record<string, string> {
  const b = SHARE_BRAND[personalityId]
  return {
    '--share-accent': b.accent,
    '--share-accent-dim': b.accentDim,
    '--share-accent-soft': b.accentSoft,
    '--share-accent-glow': b.accentGlow,
    '--share-accent-bg': b.accentBg,
  }
}

export function getShareSiteUrl() {
  if (typeof window !== 'undefined' && window.location.host) {
    return window.location.host
  }
  return 'ai-meme-app.vercel.app'
}

/** 超真實 Truth Event 分享卡：冷色、安靜、白銀感 */
export function getTruthShareBrandStyle(): Record<string, string> {
  return {
    '--share-accent': '#e8ecf2',
    '--share-accent-dim': 'rgba(200, 210, 225, 0.75)',
    '--share-accent-soft': 'rgba(180, 195, 215, 0.22)',
    '--share-accent-glow': 'rgba(200, 215, 235, 0.35)',
    '--share-accent-bg': 'rgba(220, 228, 240, 0.06)',
  }
}
