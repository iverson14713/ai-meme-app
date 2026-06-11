import { getPersonalityDefinition } from './personalities/index.js'
import type { PersonalityId } from './personalities/types.js'
import {
  pickPersonalityAnalysisLines,
  pickSentencePattern,
  withSentencePatternOpening,
} from './personalities/sentencePatternUtils.js'
import type { QuestionCategory } from './types/questionCategory.js'

export function pickPersonalityVerdict(
  personalityId: PersonalityId,
  category: QuestionCategory,
): string {
  const pool = getPersonalityDefinition(personalityId).fallbackVerdicts[category]
  const base = pool[Math.floor(Math.random() * pool.length)]

  if (Math.random() < 0.85) {
    return withSentencePatternOpening(base, pickSentencePattern(personalityId))
  }

  return base
}

export { pickPersonalityAnalysisLines }
