import type { PersonalityDefinition } from '../types.js'

/** 人格素材（systemPrompt 於 definitions/index 組裝） */
export type PersonalityInput = Omit<PersonalityDefinition, 'systemPrompt'>

export function definePersonality(input: PersonalityInput): PersonalityInput {
  return input
}
