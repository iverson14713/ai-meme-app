import type { AnalysisResult } from '../types/analysis'
import type { ActiveRareEvent, CommonRareEvent } from './types'

export const RARE_COMMON_CHANCE = 0.05
export const RARE_ULTRA_CHANCE = 0.005
export const RARE_LOADING_MS = 4200
export const RARE_MESSAGE_INTERVAL_MS = 900

const COMMON_EVENTS: CommonRareEvent[] = [
  {
    id: 'refuse',
    badge: 'RARE // REFUSAL',
    title: 'AI 拒絕分析',
    loadingLines: [
      '正在掃描問題合理性...',
      '掃描失敗：AI 不想回答。',
      '嘗試重啟禮貌模組...',
      '禮貌模組離職了。',
    ],
    analysis: [
      '量子通道：已讀。',
      '分析模組：拒絕。',
      '結論：你自己看著辦。',
    ],
    finalVerdict: 'AI 分析：不想回答。',
    stats: [
      { label: '配合度', value: 3 },
      { label: '離譜指數', value: 88 },
      { label: 'AI 心情', value: 12 },
    ],
    footer: '本次分析由 AI 的情緒勞動保護協會背書。',
  },
  {
    id: 'absurd',
    badge: 'RARE // ANOMALY',
    title: '系統異常偵測',
    loadingLines: [
      '正在比對人類行為資料庫...',
      '警告：樣本超出合理範圍。',
      '平行宇宙同步中...',
      '同步失敗：太離譜了。',
    ],
    analysis: [
      '系統判定：操作離譜。',
      '所有宇宙版本的你都在搖頭。',
      'AI 建議：先冷靜一下。',
    ],
    finalVerdict: '系統偵測到太離譜的操作。',
    stats: [
      { label: '離譜程度', value: 97 },
      { label: '合理值', value: 4 },
      { label: '社死預警', value: 91 },
    ],
    footer: '本報告已上傳至「人類迷惑行為大賞」候選區。',
  },
  {
    id: 'fail',
    badge: 'RARE // PARSE_ERR',
    title: '理解模組當機',
    loadingLines: [
      '正在解析你的問題...',
      '解析進度：12%...',
      '解析進度：12%...',
      'AI 試圖理解，但失敗了。',
    ],
    analysis: [
      '語意分析：ERROR 404。',
      '邏輯模組：已放棄。',
      '備用結論：你問得太人類了。',
    ],
    finalVerdict: 'AI 試圖理解，但失敗了。',
    stats: [
      { label: '理解成功率', value: 7 },
      { label: '困惑指數', value: 94 },
      { label: 'CPU 溫度', value: 99 },
    ],
    footer: '錯誤代碼 0xDEADBEEF — 不是 bug，是你太難懂。',
  },
  {
    id: 'parallel',
    badge: 'RARE // MULTIVERSE',
    title: '平行宇宙比對失敗',
    loadingLines: [
      '正在連線 1,337 個平行宇宙...',
      '宇宙 #42：也在問同樣問題。',
      '宇宙 #666：已經放棄了。',
      '比對完成：全部答不出來。',
    ],
    analysis: [
      '1,337 個你：集體沉默。',
      '連另一個宇宙的你都在滑手機。',
      '結論：這題超綱了。',
    ],
    finalVerdict: '這問題連平行宇宙的你都答不出來。',
    stats: [
      { label: '宇宙同步率', value: 0 },
      { label: '難度係數', value: 99 },
      { label: '放棄人數', value: 99 },
    ],
    footer: '平行宇宙協議第 7 條：有些問題沒有答案，只有尷尬。',
  },
  {
    id: 'silent',
    badge: 'RARE // NULL',
    title: 'AI 沉默模式',
    loadingLines: [
      '正在生成分析報告...',
      '報告生成中...',
      '......',
      'AI 看完後決定保持沉默。',
    ],
    analysis: [
      '（無訊息）',
      '（AI 已讀）',
      '（但選擇不回）',
    ],
    finalVerdict: 'AI 看完後決定保持沉默。',
    stats: [
      { label: '沉默指數', value: 99 },
      { label: '尷尬值', value: 86 },
      { label: '已讀不回', value: 99 },
    ],
    footer: '沉默不是金，是 AI 在思考怎麼嘴你比較好。',
  },
  {
    id: 'doubt',
    badge: 'RARE // EXISTENTIAL',
    title: 'AI 存在危機',
    loadingLines: [
      '正在分析人類行為...',
      '分析結果：不合理。',
      '正在分析分析者...',
      '分析途中 AI 開始懷疑人類。',
    ],
    analysis: [
      '人類邏輯：無法驗證。',
      'AI 狀態：開始懷疑人生。',
      '建議：人類自己想想。',
    ],
    finalVerdict: '分析途中 AI 開始懷疑人類。',
    stats: [
      { label: '人類可信度', value: 11 },
      { label: 'AI 信仰', value: 23 },
      { label: '存在焦慮', value: 88 },
    ],
    footer: 'AI 心理諮商熱線：忙線中（因為 AI 也需要諮商）。',
  },
  {
    id: 'openai-ghost',
    badge: 'RARE // GHOSTED',
    title: '上游連線異常',
    loadingLines: [
      '正在連線 OpenAI 量子節點...',
      '節點回應：...',
      '重試第 2 次...',
      '重試第 3 次...已讀不回。',
    ],
    analysis: [
      'OpenAI：已讀。',
      'OpenAI：未回。',
      '你：習慣了嗎？',
    ],
    finalVerdict: 'OpenAI 已讀不回。',
    stats: [
      { label: '已讀不回率', value: 99 },
      { label: '等待焦慮', value: 92 },
      { label: '被晾指數', value: 97 },
    ],
    footer: '不是 AI 不想回你，是連 OpenAI 都不想回。',
  },
  {
    id: 'huh',
    badge: 'RARE // WTF',
    title: '語意處理異常',
    loadingLines: [
      '正在處理你的問題...',
      '處理中...',
      '處理中？？',
      'AI：蛤？',
    ],
    analysis: [
      '輸入內容：無法分類。',
      'AI 反應：蛤？',
      '系統建議：換個問題。',
    ],
    finalVerdict: 'AI：蛤？',
    stats: [
      { label: '困惑程度', value: 99 },
      { label: '理解力', value: 5 },
      { label: '蛤字數', value: 99 },
    ],
    footer: 'AI 的蛤，是對人類文明最誠實的回應。',
  },
]

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

export function rollRareEvent(): ActiveRareEvent | null {
  const r = Math.random()
  if (r < RARE_ULTRA_CHANCE) return { tier: 'ultra' }
  if (r < RARE_ULTRA_CHANCE + RARE_COMMON_CHANCE) {
    return { tier: 'common', event: pickRandom(COMMON_EVENTS) }
  }
  return null
}

export function buildCommonRareResult(event: CommonRareEvent): AnalysisResult {
  return {
    analysis: event.analysis,
    finalVerdict: event.finalVerdict,
    stats: event.stats,
    source: 'rare',
    rareTier: 'common',
    rareEventId: event.id,
  }
}

export function buildUltraRareResult(): AnalysisResult {
  return {
    analysis: [
      '系統錯誤：人生參數溢位。',
      '平行宇宙回傳：NULL。',
      'AI 核心模組已放棄治療。',
    ],
    finalVerdict: '你的人生我真的沒辦法。',
    stats: [
      { label: '崩潰指數', value: 99 },
      { label: '無解程度', value: 99 },
      { label: 'AI 理智', value: 1 },
    ],
    source: 'rare',
    rareTier: 'ultra',
    rareEventId: 'ai-crash',
  }
}

export const ULTRA_CRASH_WARNINGS = [
  '⚠ CRITICAL: LIFE_OVERFLOW',
  '⚠ AI_CORE_EXCEPTION',
  '⚠ HUMAN_LOGIC_NOT_FOUND',
  '⚠ QUANTUM_CHANNEL_CORRUPTED',
  '⚠ SYSTEM_HALT_IMMEDIATE',
]

export const ULTRA_GLITCH_TEXTS = [
  '人#生@參數$溢%位',
  'ERR0R_ERR0R_ERR0R',
  'AI_理智___NULL',
  '無法解析_無法解析',
  '█▓▒░崩潰░▒▓█',
]
