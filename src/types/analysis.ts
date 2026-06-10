export type StatItem = {
  label: string
  value: number
}

export type AnalysisResult = {
  analysis: [string, string, string]
  finalVerdict: string
  stats: [StatItem, StatItem, StatItem]
  source: 'openai' | 'fallback' | 'rare'
  rareTier?: 'common' | 'ultra' | 'truth'
  rareEventId?: string
}

export type OpenAIAnalysisPayload = {
  analysis: string[]
  finalVerdict: string
  stats: StatItem[]
}
