import { getPersonalityDefinition } from './personalities/index.js'
import type { PersonalityId } from './personalities/types.js'
import type { QuestionCategory } from './types/questionCategory.js'

export function pickPersonalityVerdict(
  personalityId: PersonalityId,
  category: QuestionCategory,
): string {
  const pool = getPersonalityDefinition(personalityId).fallbackVerdicts[category]
  return pool[Math.floor(Math.random() * pool.length)]
}
