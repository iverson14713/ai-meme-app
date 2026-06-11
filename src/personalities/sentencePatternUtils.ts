import type { PersonalityId } from './types.js'
import { getPersonalityDefinition } from './index.js'

function shuffle<T>(items: T[]): T[] {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

export function pickSentencePattern(personalityId: PersonalityId): string {
  const { sentencePatterns } = getPersonalityDefinition(personalityId)
  return sentencePatterns[Math.floor(Math.random() * sentencePatterns.length)]
}

export function pickUniqueSentencePatterns(
  personalityId: PersonalityId,
  count: number,
): string[] {
  const { sentencePatterns } = getPersonalityDefinition(personalityId)
  return shuffle(sentencePatterns).slice(0, Math.min(count, sentencePatterns.length))
}

export function withSentencePatternOpening(
  text: string,
  pattern: string,
): string {
  return `${pattern}${text}`
}

const FALLBACK_ANALYSIS_TAILS = [
  '你心裡其實有數了。',
  '別再繞路了。',
  '這題沒那麼玄。',
  '你只是在拖時間。',
  '答案早就浮上來了。',
  '別再找人幫你背鍋。',
  '你只是在等一個台階。',
]

export function pickPersonalityAnalysisLines(
  personalityId: PersonalityId,
): [string, string, string] {
  const patterns = pickUniqueSentencePatterns(personalityId, 3)
  const tails = shuffle(FALLBACK_ANALYSIS_TAILS).slice(0, 3)

  return [
    withSentencePatternOpening(tails[0], patterns[0]),
    withSentencePatternOpening(tails[1], patterns[1]),
    withSentencePatternOpening(tails[2], patterns[2]),
  ]
}
