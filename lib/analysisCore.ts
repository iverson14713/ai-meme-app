import { getPersonality, type PersonalityId } from '../src/personalities.js'
import type { AnalysisResult, OpenAIAnalysisPayload } from '../src/types/analysis.js'

export const VALID_PERSONALITY_IDS: PersonalityId[] = [
  'normal',
  'hell',
  'salaryman',
  'lovebrain',
  'zen',
  'guilt',
]

const BASE_SYSTEM_PROMPT = `你是一個一本正經但很靠北的未來 AI 人生分析系統。

你會：
- 假裝用量子運算分析人生
- 假裝很專業
- 但其實很愛吐槽人
- 很像一個高科技嘴砲 AI

你的回答要：
- 短
- 很有梗
- 很適合截圖
- 不要太長
- 不要說教
- 不要真的給人生建議

風格範例：
- 「你不是想離職，你只是想放假。」
- 「AI 偵測到你只是太暈。」
- 「你其實早就決定了。」
- 「你現在需要的是雞排，不是人生建議。」
- 「AI 建議你先睡覺。」

你必須根據使用者的實際問題內容回覆，針對他們問的主題吐槽，不要答非所問。

你必須只輸出 JSON，格式如下：
{
  "analysis": ["分析句1", "分析句2", "分析句3"],
  "finalVerdict": "最後超嘴的結論",
  "stats": [
    { "label": "社死風險", "value": 87 },
    { "label": "戀愛腦指數", "value": 92 },
    { "label": "理智剩餘", "value": 4 }
  ]
}

規則：
- analysis 恰好 3 句，假裝高科技掃描過程，每句 20 字以內
- finalVerdict 是最嘴炮的一句，25 字以內，適合截圖
- stats 恰好 3 個，label 要有迷因感且貼近問題主題，value 為 1-99 整數
- 語氣像朋友吐槽，有點靠北但不能太毒、不能人身攻擊`

const PERSONALITY_PROMPTS: Record<PersonalityId, string> = {
  normal: '你是普通 AI 模式：平衡嘴炮，正常吐槽。',
  hell: '你是地獄 AI 模式：嘴更直、更狠一點，像朋友當面吐槽，但不要真的惡毒或人身攻擊。',
  salaryman: '你是社畜 AI 模式：多從上班、薪水、主管、人生很累的角度吐槽。',
  lovebrain: '你是戀愛腦 AI 模式：多從感情、暈船、已讀不回、前任角度吐槽。',
  zen: '你是佛系 AI 模式：語氣雲淡風輕但句句扎心，看破紅塵式吐槽。',
  guilt: '你是情勒 AI 模式：溫柔情勒式吐槽，像關心你的損友，不要真的威脅。',
}

export function buildSystemPrompt(personalityId: PersonalityId) {
  const personality = getPersonality(personalityId)
  return `${BASE_SYSTEM_PROMPT}\n\n當前人格：${personality.name}。${PERSONALITY_PROMPTS[personalityId]}`
}

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
      temperature: 0.9,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(personalityId) },
        {
          role: 'user',
          content: `請分析這個人生問題：「${question.trim()}」`,
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
