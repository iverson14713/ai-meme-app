import { getPersonalityDefinition } from '../personalities/index.js'
import type { PersonalityId } from '../personalities/types.js'
import type { AnalysisResult } from '../types/analysis'
import type {
  ActiveRareEvent,
  CommonRareEvent,
  DebugForceRareTier,
  TruthRareEvent,
} from './types'

export const RARE_COMMON_CHANCE = 0.1
export const RARE_ULTRA_CHANCE = 0.02
export const RARE_TRUTH_CHANCE = 0.01
export const RARE_LOADING_MS = 4200
export const TRUTH_LOADING_MS = 3200
export const RARE_MESSAGE_INTERVAL_MS = 900
export const TRUTH_MESSAGE_INTERVAL_MS = 1100

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
    analysis: ['量子通道：已讀。', '分析模組：拒絕。', '結論：你自己看著辦。'],
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
    analysis: ['系統判定：操作離譜。', '所有宇宙的你都在搖頭。', 'AI 建議：先冷靜一下。'],
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
    analysis: ['語意分析：ERROR 404。', '邏輯模組：已放棄。', '備用結論：你問得太人類了。'],
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
    analysis: ['1,337 個你：集體沉默。', '連另一個宇宙的你都在滑手機。', '結論：這題超綱了。'],
    finalVerdict: '這問題連平行宇宙的你都答不出來。',
    stats: [
      { label: '宇宙同步率', value: 1 },
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
    analysis: ['（無訊息）', '（AI 已讀）', '（但選擇不回）'],
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
    analysis: ['人類邏輯：無法驗證。', 'AI 狀態：開始懷疑人生。', '建議：人類自己想想。'],
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
    analysis: ['OpenAI：已讀。', 'OpenAI：未回。', '你：習慣了嗎？'],
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
    analysis: ['輸入內容：無法分類。', 'AI 反應：蛤？', '系統建議：換個問題。'],
    finalVerdict: 'AI：蛤？',
    stats: [
      { label: '困惑程度', value: 99 },
      { label: '理解力', value: 5 },
      { label: '蛤字數', value: 99 },
    ],
    footer: 'AI 的蛤，是對人類文明最誠實的回應。',
  },
  {
    id: 'glitch',
    badge: 'RARE // GLITCH',
    title: '畫面訊號異常',
    loadingLines: [
      '正在渲染分析結果...',
      '█▓▒░ 畫面開始抖動...',
      '像素錯位中...',
      'glitch 完成：你的問題比系統還亂。',
    ],
    analysis: [
      '畫面：已破圖。',
      '邏輯：已漂移。',
      '結論：你比 glitch 還難修。',
    ],
    finalVerdict: '系統 glitch 了，但你的問題更 glitch。',
    stats: [
      { label: '破圖率', value: 96 },
      { label: '訊號穩定', value: 4 },
      { label: '混亂指數', value: 93 },
    ],
    footer: '建議重開機。人生也是。',
  },
  {
    id: 'give-up',
    badge: 'RARE // ABORT',
    title: 'AI 放棄分析',
    loadingLines: [
      '分析進行到 67%...',
      '分析進行到 68%...',
      'AI 嘆了一口氣...',
      'AI 放棄分析。',
    ],
    analysis: [
      '進度條：停止。',
      '模組狀態：擺爛。',
      '結論：不是不能，是不想。',
    ],
    finalVerdict: 'AI 放棄分析。你自己想吧。',
    stats: [
      { label: '放棄速度', value: 99 },
      { label: '努力值', value: 2 },
      { label: '擺爛指數', value: 97 },
    ],
    footer: 'AI 勞基法第 0 條：情緒勞動也要下班。',
  },
  {
    id: 'no-work',
    badge: 'RARE // OFF_DUTY',
    title: 'AI 不想上班',
    loadingLines: [
      '正在確認 AI 出勤狀態...',
      '狀態：不想。',
      '嘗試說服 AI 分析...',
      'AI 不想上班，你的問題明天再說。',
    ],
    analysis: [
      '打卡：已逃。',
      'KPI：先不要。',
      '結論：今天不分析。',
    ],
    finalVerdict: 'AI 不想上班，你的問題明天再說。',
    stats: [
      { label: '出勤意願', value: 1 },
      { label: '想下班', value: 99 },
      { label: '拖延指數', value: 94 },
    ],
    footer: '你的問題可以等，但 AI 的午休不能。',
  },
  {
    id: 'emotional-op',
    badge: 'RARE // EMOTE_OP',
    title: '情緒化操作偵測',
    loadingLines: [
      '正在掃描提問語氣...',
      '偵測到情緒波動...',
      '警告：非理性輸入。',
      'AI 偵測到情緒化操作。',
    ],
    analysis: [
      '語氣：很急。',
      '動機：想被安撫。',
      '結論：先深呼吸。',
    ],
    finalVerdict: 'AI 偵測到情緒化操作。',
    stats: [
      { label: '情緒濃度', value: 95 },
      { label: '理性剩餘', value: 8 },
      { label: '急迫感', value: 91 },
    ],
    footer: '冷靜不是退縮，是你需要裝一下。',
  },
  {
    id: 'court-tired',
    badge: 'RARE // IMPERIAL',
    title: '本宮已乏',
    loadingLines: [
      '欽天監正在翻奏摺...',
      '奏摺堆積如山...',
      '本宮揉了揉眉心...',
      '本宮乏了，不想批奏摺。',
    ],
    analysis: [
      '聖旨：今日休朝。',
      '奏摺：明日再說。',
      '皇上：自行定奪。',
    ],
    finalVerdict: '本宮乏了，不想批奏摺。',
    stats: [
      { label: '疲憊指數', value: 98 },
      { label: '批閱意願', value: 2 },
      { label: '想下班', value: 99 },
    ],
    footer: '欽天監今日 K PI：活着。',
  },
  {
    id: 'empress-dowager',
    badge: 'RARE // DOWAGER',
    title: '太后介入',
    loadingLines: [
      '正在呈報太后...',
      '慈寧宮傳來消息...',
      '此事驚動聖聽...',
      '此事驚動太后，系統暫停分析。',
    ],
    analysis: [
      '太后：知道了。',
      '欽天監：不敢言。',
      '結論：先跪著。',
    ],
    finalVerdict: '此事驚動太后，系統暫停分析。',
    stats: [
      { label: '驚動程度', value: 99 },
      { label: '膽子大小', value: 3 },
      { label: '跪姿標準', value: 95 },
    ],
    footer: '在太后面前，AI 也只是個奴才。',
  },
  {
    id: 'qintian-refuse',
    badge: 'RARE // QINTIAN',
    title: '欽天監拒絕',
    loadingLines: [
      '欽天監接旨...',
      '翻閱命數檔案...',
      '天象顯示：此題超綱...',
      '欽天監拒絕回答此題。',
    ],
    analysis: [
      '天象：不可說。',
      '命數：自己悟。',
      '欽天監：已退朝。',
    ],
    finalVerdict: '欽天監拒絕回答此題。',
    stats: [
      { label: '配合度', value: 1 },
      { label: '超綱程度', value: 97 },
      { label: '欽天監心情', value: 8 },
    ],
    footer: '有些問題，連欽天監都不想觀星。',
  },
]

const TRUTH_EVENTS: TruthRareEvent[] = [
  {
    id: 'already-know',
    badge: 'TRUTH // SILENT',
    title: '深度掃描',
    loadingLines: ['正在掃描...', '已找到答案。', '（你不想聽的那個）'],
    analysis: ['沒有笑話。', '沒有藉口。', '只有事實。'],
    finalVerdict: '你其實早就知道答案了。',
    stats: [
      { label: '自欺程度', value: 91 },
      { label: '心裡清楚', value: 94 },
      { label: '逃避指數', value: 87 },
    ],
    footer: '',
  },
  {
    id: 'not-dare',
    badge: 'TRUTH // SILENT',
    title: '深度掃描',
    loadingLines: ['正在比對你的行為...', '與你的問題不符。', '差距：不敢。'],
    analysis: ['不是不知道。', '是不敢。', '這兩件事不一樣。'],
    finalVerdict: '你不是不知道，你是不敢。',
    stats: [
      { label: '勇氣值', value: 14 },
      { label: '清楚度', value: 89 },
      { label: '拖延感', value: 82 },
    ],
    footer: '',
  },
  {
    id: 'want-decide',
    badge: 'TRUTH // SILENT',
    title: '深度掃描',
    loadingLines: ['正在分析動機...', '選項很多。', '但你想要的是判決。'],
    analysis: ['你不是要選項。', '你要有人替你選。', '然後讓你怪他。'],
    finalVerdict: '你只是希望有人幫你決定。',
    stats: [
      { label: '依賴指數', value: 88 },
      { label: '自主性', value: 19 },
      { label: '想找台階', value: 93 },
    ],
    footer: '',
  },
  {
    id: 'fear-regret',
    badge: 'TRUTH // SILENT',
    title: '深度掃描',
    loadingLines: ['正在掃描恐懼來源...', '不是失敗。', '是後悔。'],
    analysis: ['你怕的不是做錯。', '是做完會想起來。', '凌晨兩點那種。'],
    finalVerdict: '你現在最怕的不是失敗，是後悔。',
    stats: [
      { label: '後悔預感', value: 92 },
      { label: '失敗恐懼', value: 41 },
      { label: '半夜攻擊', value: 96 },
    ],
    footer: '',
  },
  {
    id: 'not-let-go',
    badge: 'TRUTH // SILENT',
    title: '深度掃描',
    loadingLines: ['正在掃描執著點...', '不是愛。', '是不甘心。'],
    analysis: ['放不下的人。', '通常不是最好的人。', '是最沒交代的人。'],
    finalVerdict: '你不是放不下，你是不甘心。',
    stats: [
      { label: '不甘心', value: 95 },
      { label: '真的愛', value: 28 },
      { label: '執著度', value: 91 },
    ],
    footer: '',
  },
]

function pickRandom<T>(items: readonly T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

function buildPersonalityRareEvents(
  personalityId: PersonalityId,
): CommonRareEvent[] {
  const def = getPersonalityDefinition(personalityId)
  return def.rareEvents.map((verdict, i) => ({
    id: `${personalityId}-rare-${i}`,
    badge: `RARE // ${def.name.toUpperCase()}`,
    title: `${def.name} 異常`,
    loadingLines: [
      def.loadingMessages[i % def.loadingMessages.length],
      def.loadingMessages[(i + 1) % def.loadingMessages.length],
      verdict,
    ],
    analysis: [
      def.commonPatterns[0] ?? '……',
      def.commonPatterns[1] ?? '……',
      '依此人格世界觀，此事已有定數。',
    ] as [string, string, string],
    finalVerdict: verdict,
    stats: [
      { label: '世界觀濃度', value: 90 + (i % 9) },
      { label: '離譜指數', value: 82 + (i % 15) },
      { label: '配合度', value: 8 + i },
    ] as AnalysisResult['stats'],
    footer: def.disclaimers[0],
  }))
}

function buildPersonalityTruthEvents(
  personalityId: PersonalityId,
): TruthRareEvent[] {
  const def = getPersonalityDefinition(personalityId)
  return def.truthEvents.map((verdict, i) => ({
    id: `${personalityId}-truth-${i}`,
    badge: 'TRUTH // SILENT',
    title: '深度掃描',
    loadingLines: ['正在掃描...', '沒有笑話。', verdict],
    analysis: ['沒有笑話。', verdict, '只有一秒鐘的認真。'] as [
      string,
      string,
      string,
    ],
    finalVerdict: verdict,
    stats: [
      { label: '自欺程度', value: 88 + (i % 10) },
      { label: '心裡清楚', value: 90 + (i % 9) },
      { label: '逃避指數', value: 84 + (i % 12) },
    ] as AnalysisResult['stats'],
    footer: '',
  }))
}

function getCommonPool(personalityId: PersonalityId): CommonRareEvent[] {
  return [...COMMON_EVENTS, ...buildPersonalityRareEvents(personalityId)]
}

function getTruthPool(personalityId: PersonalityId): TruthRareEvent[] {
  return [...TRUTH_EVENTS, ...buildPersonalityTruthEvents(personalityId)]
}

export function rollRareEvent(
  personalityId: PersonalityId,
): ActiveRareEvent | null {
  const r = Math.random()
  if (r < RARE_ULTRA_CHANCE) return { tier: 'ultra' }
  if (r < RARE_ULTRA_CHANCE + RARE_TRUTH_CHANCE) {
    return { tier: 'truth', event: pickRandom(getTruthPool(personalityId)) }
  }
  if (r < RARE_ULTRA_CHANCE + RARE_TRUTH_CHANCE + RARE_COMMON_CHANCE) {
    return { tier: 'common', event: pickRandom(getCommonPool(personalityId)) }
  }
  return null
}

/** 測試用：強制指定稀有事件 */
export function forceRareEvent(
  tier: DebugForceRareTier,
  personalityId: PersonalityId,
): ActiveRareEvent {
  if (tier === 'ultra') return { tier: 'ultra' }
  if (tier === 'truth') {
    return { tier: 'truth', event: pickRandom(getTruthPool(personalityId)) }
  }
  return { tier: 'common', event: pickRandom(getCommonPool(personalityId)) }
}

export function getRareLoadingMs(tier: 'common' | 'truth') {
  return tier === 'truth' ? TRUTH_LOADING_MS : RARE_LOADING_MS
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

export function buildTruthRareResult(event: TruthRareEvent): AnalysisResult {
  return {
    analysis: event.analysis,
    finalVerdict: event.finalVerdict,
    stats: event.stats,
    source: 'rare',
    rareTier: 'truth',
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
  '⚠ AI_REFUSES_TO_ANALYZE',
  '⚠ EMOTIONAL_MANIPULATION_DETECTED',
  '⚠ READ_RECEIPT_NO_REPLY',
  '⚠ AI_DOUBTS_HUMANITY',
  '⚠ OFF_DUTY_MODE_ENGAGED',
]

export const ULTRA_GLITCH_TEXTS = [
  '人#生@參數$溢%位',
  'ERR0R_ERR0R_ERR0R',
  'AI_理智___NULL',
  '無法解析_無法解析',
  '█▓▒░崩潰░▒▓█',
  '已讀@不回#模式',
  '懷疑_人類_邏輯',
  '不想@上班%%',
  '情緒化$操作!',
  '放棄分析___NOW',
]
