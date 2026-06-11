import { getAnalyzeApiUrl } from '../config/api'
import type { PersonalityId } from '../personalities'
import type { AnalysisResult } from '../types/analysis'

export async function fetchOpenAIAnalysis(
  question: string,
  personalityId: PersonalityId,
): Promise<AnalysisResult> {
  const response = await fetch(getAnalyzeApiUrl(), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ question: question.trim(), personalityId }),
  })

  if (!response.ok) {
    throw new Error(`Analyze API error ${response.status}`)
  }

  const data = (await response.json()) as AnalysisResult
  if (!data.finalVerdict || !Array.isArray(data.analysis) || !Array.isArray(data.stats)) {
    throw new Error('Invalid analyze API response')
  }

  return { ...data, source: 'openai' }
}
