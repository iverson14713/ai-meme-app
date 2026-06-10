import {
  callOpenAI,
  isValidPersonalityId,
} from '../lib/analysisCore.js'

type AnalyzeRequestBody = {
  question?: string
  personalityId?: string
}

type VercelRequest = {
  method?: string
  body?: AnalyzeRequestBody
}

type VercelResponse = {
  setHeader: (key: string, value: string) => void
  status: (code: number) => {
    json: (data: unknown) => void
    end: () => void
  }
}

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  response.setHeader('Access-Control-Allow-Origin', '*')
  response.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  response.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (request.method === 'OPTIONS') {
    return response.status(204).end()
  }

  if (request.method !== 'POST') {
    return response.status(405).json({ error: 'Method not allowed' })
  }

  const apiKey = process.env.OPENAI_API_KEY?.trim()
  if (!apiKey) {
    return response.status(500).json({ error: 'Server configuration error' })
  }

  const question = request.body?.question?.trim()
  const personalityId = request.body?.personalityId

  if (!question) {
    return response.status(400).json({ error: 'Question is required' })
  }

  if (!isValidPersonalityId(personalityId)) {
    return response.status(400).json({ error: 'Invalid personalityId' })
  }

  try {
    const result = await callOpenAI(question, personalityId, apiKey)
    return response.status(200).json(result)
  } catch (error) {
    console.error('[api/analyze] OpenAI request failed:', error)
    return response.status(502).json({ error: 'Analysis failed' })
  }
}
