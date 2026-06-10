import {
  getPersonalityDefinition,
  type PersonalityId,
} from '../src/personalities/index.js'
import { buildUserPromptFromDefinition } from './personalityPromptBuilder.js'

export function buildSystemPrompt(personalityId: PersonalityId): string {
  return getPersonalityDefinition(personalityId).systemPrompt
}

export function buildUserPrompt(
  personalityId: PersonalityId,
  question: string,
): string {
  return buildUserPromptFromDefinition(
    getPersonalityDefinition(personalityId),
    question,
  )
}
