import type { QuestionCategory } from '../types/questionCategory.js'

export type PersonalityId =
  | 'normal'
  | 'hell'
  | 'hellspicy'
  | 'salaryman'
  | 'lovebrain'
  | 'zen'
  | 'guilt'
  | 'ancient'

export type QuestionLenses = Record<QuestionCategory, string>

export type FallbackVerdicts = Record<QuestionCategory, string[]>

/** 完整人格定義：世界觀 + UI + fallback + 事件素材 */
export type PersonalityDefinition = {
  id: PersonalityId
  name: string
  tagline: string
  loadingBadge: string
  loadingTitle: string
  holdMessage: string
  loadingFooter: string
  reportTitle: string
  seal: string
  worldview: string
  beliefs: string[]
  analysisStyle: string[]
  commonPatterns: string[]
  sentencePatterns: string[]
  loadingMessages: string[]
  rareEvents: string[]
  truthEvents: string[]
  /** 由 worldview / beliefs / analysisStyle 等組裝的完整 system prompt */
  systemPrompt: string
  questionLenses: QuestionLenses
  forbidden: string[]
  userPromptDirective: string
  disclaimers: string[]
  fallbackVerdicts: FallbackVerdicts
}

export type Personality = PersonalityDefinition
