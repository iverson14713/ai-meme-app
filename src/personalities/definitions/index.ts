import { buildSystemPromptFromDefinition } from '../../../lib/personalityPromptBuilder.js'
import type { PersonalityDefinition, PersonalityId } from '../types.js'
import { ancientPersonality } from './ancient.js'
import { guiltPersonality } from './guilt.js'
import { hellPersonality } from './hell.js'
import { hellspicyPersonality } from './hellspicy.js'
import { lovebrainPersonality } from './lovebrain.js'
import { normalPersonality } from './normal.js'
import { salarymanPersonality } from './salaryman.js'
import { zenPersonality } from './zen.js'
import type { PersonalityInput } from './shared.js'

function withSystemPrompt(input: PersonalityInput): PersonalityDefinition {
  return {
    ...input,
    systemPrompt: buildSystemPromptFromDefinition(input),
  }
}

export const PERSONALITY_DEFINITIONS: PersonalityDefinition[] = [
  withSystemPrompt(normalPersonality),
  withSystemPrompt(hellPersonality),
  withSystemPrompt(hellspicyPersonality),
  withSystemPrompt(salarymanPersonality),
  withSystemPrompt(lovebrainPersonality),
  withSystemPrompt(zenPersonality),
  withSystemPrompt(guiltPersonality),
  withSystemPrompt(ancientPersonality),
]

export const PERSONALITY_MAP: Record<PersonalityId, PersonalityDefinition> =
  Object.fromEntries(
    PERSONALITY_DEFINITIONS.map((def) => [def.id, def]),
  ) as Record<PersonalityId, PersonalityDefinition>

export function getPersonalityDefinition(
  id: PersonalityId,
): PersonalityDefinition {
  return PERSONALITY_MAP[id] ?? normalPersonality
}
