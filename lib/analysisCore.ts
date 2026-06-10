import type { PersonalityId } from '../src/personalities.js'
import {
  buildSystemPrompt,
  buildUserPrompt,
} from './personalityPrompts.js'
import type { AnalysisResult, OpenAIAnalysisPayload } from '../src/types/analysis.js'

export const VALID_PERSONALITY_IDS: PersonalityId[] = [
  'normal',
  'hell',
  'hellspicy',
  'salaryman',
  'lovebrain',
  'zen',
  'guilt',
]

function clampStatValue(value: unknown): number {
  const num = typeof value === 'number' ? value : Number(value)
  if (!Number.isFinite(num)) return 50
  return Math.max(1, Math.min(99, Math.round(num)))
}

export function normalizePayload(
  raw: OpenAIAnalysisPayload,
): AnalysisResult | null {
  if (
    !Array.isArray(raw.analysis) ||
    typeof raw.finalVerdict !== 'string' ||
    !Array.isArray(raw.stats)
  ) {
    return null
  }

  const analysis = raw.analysis
    .filter(
      (line): line is string =>
        typeof line === 'string' && line.trim().length > 0,
    )
    .slice(0, 3)

  const stats = raw.stats
    .filter((item): item is { label: string; value: number } => {
      return (
        typeof item === 'object' &&
        item !== null &&
        typeof item.label === 'string' &&
        item.label.trim().length > 0 &&
        item.value !== undefined
      )
    })
    .slice(0, 3)
    .map((item) => ({
      label: item.label.trim(),
      value: clampStatValue(item.value),
    }))

  if (analysis.length < 3 || stats.length < 3) return null

  return {
    analysis: [analysis[0], analysis[1], analysis[2]],
    finalVerdict: raw.finalVerdict.trim(),
    stats: [stats[0], stats[1], stats[2]],
    source: 'openai',
  }
}

function extractJson(content: string): OpenAIAnalysisPayload | null {
  const trimmed = content.trim()
  try {
    return JSON.parse(trimmed) as OpenAIAnalysisPayload
  } catch {
    const match = trimmed.match(/\{[\s\S]*\}/)
    if (!match) return null
    try {
      return JSON.parse(match[0]) as OpenAIAnalysisPayload
    } catch {
      return null
    }
  }
}

export async function callOpenAI(
  question: string,
  personalityId: PersonalityId,
  apiKey: string,
): Promise<AnalysisResult> {
  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      temperature: 1.35,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(personalityId) },
        {
          role: 'user',
          content: buildUserPrompt(personalityId, question),
        },
      ],
    }),
  })

  if (!response.ok) {
    const errorText = await response.text().catch(() => '')
    throw new Error(`OpenAI API error ${response.status}: ${errorText}`)
  }

  const data = (await response.json()) as {
    choices?: { message?: { content?: string } }[]
  }

  const content = data.choices?.[0]?.message?.content
  if (!content) throw new Error('OpenAI returned empty content')

  const payload = extractJson(content)
  if (!payload) throw new Error('Failed to parse OpenAI JSON response')

  const normalized = normalizePayload(payload)
  if (!normalized || !normalized.finalVerdict) {
    throw new Error('OpenAI response failed validation')
  }

  return normalized
}

export function isValidPersonalityId(value: unknown): value is PersonalityId {
  return (
    typeof value === 'string' &&
    VALID_PERSONALITY_IDS.includes(value as PersonalityId)
  )
}
