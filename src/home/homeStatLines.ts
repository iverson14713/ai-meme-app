export type HomeStatTier = 'normal' | 'ultra'

export type HomeStatLine = {
  text: string
  tier: HomeStatTier
}

export const HOME_STAT_ULTRA_CHANCE = 0.05

export const HOME_STAT_ULTRA_LINES = [
  'AI 今天心情不錯。',
  '本系統暫時不討厭人類。',
  '你看起來比昨天理智。',
  'AI 良心突然上線。',
  '今日人類迷惑指數異常偏低。',
  '本 AI 罕見地沒有嘆氣。',
] as const

export const HOME_STAT_LINES = [
  '已分析 1,234,567 個失敗人生',
  '已看透 987,654 個錯誤決定',
  '已對 543,210 位人類失望',
  '本月吐槽成功率 97%',
  '已阻止 12,345 次衝動消費',
  '已見證 98,765 次戀愛腦發作',
  '已分析 543,210 次離職衝動',
  '本系統已累積 876,543 次嘆氣',
  '已協助 432,109 位人類後悔',
  'AI 信任人類指數：3%',
  '今日迷惑行為已突破新高',
  '已觀測 765,432 次人生翻車',
  '本月韭菜濃度持續上升',
  '已看過 654,321 個不理智決定',
  'AI 對人類的耐心剩餘 2%',
  '本系統已成功勸退 0 人',
  '已累積 321,098 次情緒化操作',
  '已分析 456,789 次「我要不要離職」',
  '本月復合衝動增加 23%',
  '已記錄 888,888 次不甘心',
  '已攔截 234,567 次深夜衝動',
  '本週社畜嘆氣量創新高',
  '已旁觀 345,678 次已讀不回',
  '本月衝動告白失敗率 89%',
  '已記錄 567,890 次「再想想」',
  '量子通道今日吐槽超載',
  '已分析 123,456 次加班後悔',
  '本系統對人類期待值：極低',
  '已見證 432,100 次週一崩潰',
  '本月情緒性加倉增加 31%',
  '已處理 678,901 次找藉口申請',
  '今日人類理智在線率：4%',
  '已記錄 210,987 次「我這次不一樣」',
] as const

function pickFromPool<T extends readonly string[]>(pool: T): string {
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickHomeStatLine(exclude?: string): HomeStatLine {
  const isUltra = Math.random() < HOME_STAT_ULTRA_CHANCE
  const pool = isUltra ? HOME_STAT_ULTRA_LINES : HOME_STAT_LINES

  let text = pickFromPool(pool)
  if (exclude && pool.length > 1) {
    let attempts = 0
    while (text === exclude && attempts < 8) {
      text = pickFromPool(pool)
      attempts += 1
    }
  }

  return { text, tier: isUltra ? 'ultra' : 'normal' }
}
