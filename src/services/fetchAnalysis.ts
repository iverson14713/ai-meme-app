import type { PersonalityId } from '../personalities'
import { pickResult } from '../results'
import type { AnalysisResult } from '../types/analysis'
import { fetchOpenAIAnalysis } from './openai'

export async function fetchAnalysis(
  question: string,
  personalityId: PersonalityId,
): Promise<AnalysisResult> {
  try {
    return await fetchOpenAIAnalysis(question, personalityId)
  } catch (error) {
    console.warn('[AI有點嘴] API 失敗，使用 fallback：', error)
    return pickResult(question, personalityId)
  }
}
