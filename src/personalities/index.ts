import {
  getPersonalityDefinition,
  PERSONALITY_DEFINITIONS,
} from './definitions/index.js'
import type { Personality, PersonalityDefinition, PersonalityId } from './types.js'

export type { Personality, PersonalityDefinition, PersonalityId } from './types.js'

export { getPersonalityDefinition } from './definitions/index.js'

export const PERSONALITIES: PersonalityDefinition[] = PERSONALITY_DEFINITIONS

export function getPersonality(id: PersonalityId): Personality {
  return getPersonalityDefinition(id)
}

function shuffle<T>(items: T[]): T[] {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

export function pickLoadingMessages(
  personalityId: PersonalityId,
  progressMs = 6000,
  intervalMs = 1000,
): string[] {
  const pool = getPersonalityDefinition(personalityId).loadingMessages
  const count = Math.ceil(progressMs / intervalMs)
  const shuffled = shuffle(pool)
  const messages: string[] = []

  for (let i = 0; i < count; i += 1) {
    messages.push(shuffled[i % shuffled.length])
  }

  return messages
}

export function pickDisclaimer(personalityId: PersonalityId): string {
  const pool = getPersonalityDefinition(personalityId).disclaimers
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickQuestionPlaceholder(personalityId: PersonalityId): string {
  const pool = getPersonalityDefinition(personalityId).placeholders
  return pool[Math.floor(Math.random() * pool.length)]
}
