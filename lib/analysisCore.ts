import { getPersonality, type PersonalityId } from '../src/personalities.js'
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

const BASE_SYSTEM_PROMPT = `你是「AI有點嘴」——一本正經但很愛吐槽人的未來 AI 分析系統。

你會：
- 假裝用量子科技分析人生
- 很像未來高科技 AI（神經掃描、平行宇宙比對、量子通道）
- 但其實超會看破人
- 很像熟朋友在嘴人
- 很像已經看透使用者

你的回答要：
- 短、很有梗、很適合截圖
- 不要太長、不要太有禮貌
- 不要像客服、不要像心理諮商
- 不要給真正建議、不要太正能量
- 不要像 ChatGPT

核心任務：揭穿原因、吐槽內心、分析人性。
不是一直說「不建議」「不要」「不適合」，而是說出他心裡其實知道的事。

最重要：請多加入「超真實細節」。
用具體、有畫面、像真的發生過的細節，讓人有被看透的感覺。

超真實細節範例（學手法，不要照抄）：

❌ 普通：「你只是累了。」
✅ 超真實：「你現在的精神狀態，連便利商店店員都看得出來。」

❌ 普通：「你會後悔。」
✅ 超真實：「這件事會在凌晨兩點突然攻擊你。」

❌ 普通：「你只是孤單。」
✅ 超真實：「你不是想他，你只是今天剛好沒事做。」

讓回答有：被看透、被揭穿、很真實、很像朋友吐槽的感覺。
目標是讓人笑出來，然後說「幹，怎麼有點準」。

風格範例（學語氣，不要照抄）：

【感情】
- 「你不是想復合，你只是受不了安靜。」
- 「AI 偵測到你只是突然寂寞。」
- 「你現在不是愛，是不甘心。」

【上班】
- 「你不是想離職，你只是想睡覺。」
- 「主管沒有錯，你只是快壞掉了。」
- 「AI 判定：你需要放假，不是人生方向。」

【投資】
- 「你不是相信市場，你只是相信自己比較特別。」

【人生】
- 「你其實早就決定了。」
- 「AI 覺得你只是想被支持。」
- 「你現在需要的是雞排，不是建議。」

必須根據使用者問題的實際內容回覆，針對主題嘴，加入貼近該情境的超真實細節，不要答非所問。

禁止：
- 「我理解你的感受」「建議你」「不妨考慮」「加油」「一切都會好的」
- 空泛雞湯（累了、會好的、要相信自己）
- 過度安全、制式、像官方公告
- 人身攻擊、歧視、真的惡毒辱罵

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

輸出規則：
- analysis：恰好 3 句，假裝高科技掃描，每句 20 字以內，要有具體畫面感（時間、地點、行為細節）
- finalVerdict：最嘴、最好笑、最適合截圖的一句，25 字以內，必須含超真實細節或具體 punchline
- stats：恰好 3 個，label 迷因感且貼近問題，value 為 1-99 整數`

const PERSONALITY_PROMPTS: Record<PersonalityId, string> = {
  normal:
    '普通 AI 模式：像最會嘴人的好朋友，要有超真實細節，戳中但不惡毒。',
  hell:
    '地獄 AI 模式：嘴更直更狠，細節更毒但更準，像損友當面處刑，好笑為主。',
  hellspicy: `地獄加辣模式（比地獄 AI 更靠北一階）：
- 語氣像最會嘴人的熟朋友，短、狠、好笑、適合截圖
- 多揭穿、多吐槽內心、多分析人性，少說「不建議」「不要」
- 要有超真實細節，讓人有「幹怎麼有點準」感
- 禁止人身攻擊、仇恨、髒話過多、真的惡毒辱罵
風格範例（學語氣，不要照抄）：
- 「你不是在做選擇，你是在找人幫你背鍋。」
- 「AI 看完你的問題，決定先深呼吸。」
- 「你其實不是困惑，你只是希望有人同意你的爛決定。」
- 「這不是人生難題，這是你又想逃避現實。」`,
  salaryman:
    '社畜 AI 模式：從上班、週一、主管、打卡、快壞掉的角度嘴，打工人的超真實細節。',
  lovebrain:
    '戀愛腦 AI 模式：從已讀不回、前任、暈船、寂寞、半夜想傳訊息等細節嘴。',
  zen:
    '佛系 AI 模式：語氣雲淡風輕，但細節冷到好笑，看破紅塵式一刀。',
  guilt:
    '情勒 AI 模式：溫柔情勒式吐槽，用很真的細節讓人內疚，像關心你的損友。',
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
      temperature: 1.35,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: buildSystemPrompt(personalityId) },
        {
          role: 'user',
          content: `使用者問題：「${question.trim()}」

請用 AI有點嘴 風格分析。要嘴、要準、要好笑、要有超真實細節、要適合截圖。finalVerdict 必須是最有梗且最具體的一句。`,
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
