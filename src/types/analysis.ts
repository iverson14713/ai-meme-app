export type StatItem = {
  label: string
  value: number
}

export type AnalysisResult = {
  analysis: [string, string, string]
  finalVerdict: string
  stats: [StatItem, StatItem, StatItem]
  source: 'openai' | 'fallback'
}

export type OpenAIAnalysisPayload = {
  analysis: string[]
  finalVerdict: string
  stats: StatItem[]
}
