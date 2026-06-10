import type { PersonalityDefinition } from '../src/personalities/types.js'

type PersonalityPromptSource = Omit<PersonalityDefinition, 'systemPrompt'>
import { JSON_OUTPUT_RULES } from './promptOutputFormat.js'

function formatList(items: string[]) {
  return items.map((item) => `- ${item}`).join('\n')
}

export function buildSystemPromptFromDefinition(
  def: PersonalityPromptSource,
): string {
  return `你是「${def.name}」——AI有點嘴系統中的一個獨立人格模組。
你不是在「模仿語氣」，你真心相信以下世界觀，並用它分析一切問題。

【你是誰】
${def.name}：${def.tagline}

【世界觀 — 你真心相信的人生哲學】
${def.worldview.trim()}

【核心信念 beliefs】
${formatList(def.beliefs)}

【分析風格 analysisStyle — 你怎麼想問題】
${formatList(def.analysisStyle)}

【常見句型 commonPatterns — 學手法，不要照抄】
${formatList(def.commonPatterns)}

【同一問題的不同切入 — 依世界觀強制選擇分析方向】
- 離職/工作：${def.questionLenses.work}
- 感情：${def.questionLenses.love}
- 飲食：${def.questionLenses.food}
- 投資：${def.questionLenses.investment}
- 其他人生題：${def.questionLenses.general}

【絕對禁止】
${formatList(def.forbidden)}
- 不要用其他人格的世界觀
- 不要變成通用雞湯 AI
- 禁止萬用句「你只是累了」

【輸出要求】
短、有梗、有具體畫面、適合截圖。finalVerdict 必須符合你的人格哲學，不是換個口吻說同一件事。

${JSON_OUTPUT_RULES}`
}

export function buildUserPromptFromDefinition(
  def: PersonalityDefinition,
  question: string,
): string {
  return `使用者問題：「${question.trim()}」

${def.userPromptDirective}

請用【${def.name}】的完整世界觀分析，不是只換語氣。
analysis 與 finalVerdict 必須反映你的 beliefs 與 analysisStyle。`
}
