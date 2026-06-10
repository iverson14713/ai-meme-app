import type { AnalysisResult } from '../types/analysis'

export type CommonRareEventId =
  | 'refuse'
  | 'absurd'
  | 'fail'
  | 'parallel'
  | 'silent'
  | 'doubt'
  | 'openai-ghost'
  | 'huh'
  | 'glitch'
  | 'give-up'
  | 'no-work'
  | 'emotional-op'

export type TruthRareEventId =
  | 'already-know'
  | 'not-dare'
  | 'want-decide'
  | 'fear-regret'
  | 'not-let-go'

export type RareEventBase = {
  badge: string
  title: string
  loadingLines: string[]
  analysis: [string, string, string]
  finalVerdict: string
  stats: AnalysisResult['stats']
  footer: string
}

export type CommonRareEvent = RareEventBase & {
  id: CommonRareEventId
}

export type TruthRareEvent = RareEventBase & {
  id: TruthRareEventId
}

export type ActiveRareEvent =
  | { tier: 'common'; event: CommonRareEvent }
  | { tier: 'ultra' }
  | { tier: 'truth'; event: TruthRareEvent }

export type DebugForceRareTier = 'common' | 'ultra' | 'truth'
