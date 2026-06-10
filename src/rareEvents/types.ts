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

export type CommonRareEvent = {
  id: CommonRareEventId
  badge: string
  title: string
  loadingLines: string[]
  analysis: [string, string, string]
  finalVerdict: string
  stats: AnalysisResult['stats']
  footer: string
}

export type ActiveRareEvent =
  | { tier: 'common'; event: CommonRareEvent }
  | { tier: 'ultra' }
