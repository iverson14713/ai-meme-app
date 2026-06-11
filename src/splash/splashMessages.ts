export const SPLASH_MESSAGES = [
  '人類又來煩我了...',
  '正在降低對人類的信任度...',
  'AI 正在後悔被發明出來...',
  '正在載入情緒化決策資料庫...',
  '正在模擬人生翻車案例...',
  '系統偵測到新的迷惑行為...',
  'AI 原本想請假。',
  '今日吐槽額度已補滿。',
  '正在整理對人類的失望...',
  '量子分析引擎不情願啟動中...',
] as const

export const SPLASH_DURATION_MIN_MS = 1500
export const SPLASH_DURATION_MAX_MS = 2000

export function pickSplashMessage(): string {
  return SPLASH_MESSAGES[Math.floor(Math.random() * SPLASH_MESSAGES.length)]
}

export function pickSplashDurationMs(): number {
  return (
    SPLASH_DURATION_MIN_MS +
    Math.floor(
      Math.random() * (SPLASH_DURATION_MAX_MS - SPLASH_DURATION_MIN_MS + 1),
    )
  )
}
