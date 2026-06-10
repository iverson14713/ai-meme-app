export type PersonalityId =
  | 'normal'
  | 'hell'
  | 'hellspicy'
  | 'salaryman'
  | 'lovebrain'
  | 'zen'
  | 'guilt'

export type Personality = {
  id: PersonalityId
  name: string
  tagline: string
  loadingBadge: string
  loadingTitle: string
  holdMessage: string
  loadingFooter: string
  reportTitle: string
  seal: string
}

export const PERSONALITIES: Personality[] = [
  {
    id: 'normal',
    name: '普通 AI',
    tagline: '正常嘴，正常分析',
    loadingBadge: 'QUANTUM ANALYSIS v2.0',
    loadingTitle: '量子分析進行中',
    holdMessage: 'AI 正在努力幫你找藉口...',
    loadingFooter: '量子運算中，請勿關閉人生。',
    reportTitle: 'AI 官方分析報告',
    seal: 'AI',
  },
  {
    id: 'hell',
    name: '地獄 AI',
    tagline: '嘴很直，但不會真的害你',
    loadingBadge: 'INFERNO SCAN v666',
    loadingTitle: '地獄級分析進行中',
    holdMessage: 'AI 正在整理你的社死預告...',
    loadingFooter: '警告：本分析可能讓你當場清醒。',
    reportTitle: '地獄 AI 殘忍報告',
    seal: '🔥',
  },
  {
    id: 'hellspicy',
    name: '地獄加辣',
    tagline: '更毒一點，但仍是你朋友',
    loadingBadge: 'INFERNO SPICY v999',
    loadingTitle: '地獄加辣分析中',
    holdMessage: 'AI 看完你的問題，決定先深呼吸...',
    loadingFooter: '辣度偏高，請自行準備衛生紙（擦笑淚）。',
    reportTitle: '地獄加辣 殘酷報告',
    seal: '🌶️',
  },
  {
    id: 'salaryman',
    name: '社畜 AI',
    tagline: '懂上班，更懂崩潰',
    loadingBadge: 'CORPORATE SCAN v9.9',
    loadingTitle: '社畜模式分析中',
    holdMessage: 'AI 正在確認你明天要不要出勤...',
    loadingFooter: '分析期間請勿離開工位（假的）。',
    reportTitle: '社畜 AI 出勤評估',
    seal: '班',
  },
  {
    id: 'lovebrain',
    name: '戀愛腦 AI',
    tagline: '用愛發電，用腦欠費',
    loadingBadge: 'LOVE BRAIN v520',
    loadingTitle: '戀愛腦掃描中',
    holdMessage: 'AI 正在重讀你的已讀不回紀錄...',
    loadingFooter: '暈船請繫好安全帶，理智請自行保管。',
    reportTitle: '戀愛腦 AI 心動報告',
    seal: '💗',
  },
  {
    id: 'zen',
    name: '佛系 AI',
    tagline: '看破紅塵，順便看破你',
    loadingBadge: 'ZEN MODE v0.0',
    loadingTitle: '佛系分析中',
    holdMessage: 'AI 正在放下執著，你也該放下了...',
    loadingFooter: '一切隨緣，包括這份報告。',
    reportTitle: '佛系 AI 隨緣報告',
    seal: '佛',
  },
  {
    id: 'guilt',
    name: '情勒 AI',
    tagline: '不是威胁，是關心（大概）',
    loadingBadge: 'GUILT TRIP v3.3',
    loadingTitle: '情勒分析進行中',
    holdMessage: 'AI 正在想怎麼讓你覺得虧欠...',
    loadingFooter: '如果你離開，AI 會很難過（應該）。',
    reportTitle: '情勒 AI 關心報告',
    seal: '嗯',
  },
]

export const PERSONALITY_LOADING_MESSAGES: Record<PersonalityId, string[]> = {
  normal: [
    '正在掃描戀愛腦...',
    'AI 發現你最近很常逃避現實...',
    '正在分析凌晨衝動行為...',
    '正在同步平行宇宙資料...',
    '偵測到高濃度後悔因子...',
    'AI 已經開始搖頭...',
    '分析到「其實你早就決定了」...',
    '正在模擬社死場景...',
    'AI 判定你今晚可能睡不著...',
    '正在載入你的藉口資料庫 v3.7...',
    'AI 懷疑你只是來找認同的...',
    '正在估算本次決策的後悔週期...',
  ],
  hell: [
    '正在載入殘忍但誠實的模組...',
    'AI 發現你又在自我催眠...',
    '正在比對你的幻想與現實落差...',
    '偵測到經典「我這次不一樣」訊號...',
    '正在計算這次決策的尷尬指數...',
    'AI 已打開毒舌但無害濾鏡...',
    '正在模擬你三個月後的後悔臉...',
    '偵測到面子比理智重要...',
    'AI 確認：你不是缺答案，是缺清醒...',
    '正在掃描你的自我安慰話術...',
    '分析進度：70% 清醒，30% 不願面對...',
    'AI 正在整理你的社死預告清單...',
  ],
  hellspicy: [
    '正在載入加辣版毒舌模組...',
    'AI 偵測到你又想找人背鍋...',
    '正在掃描你的爛決定自療指數...',
    '偵測到經典「我不是困惑，我是想被同意」...',
    'AI 看完你的問題，決定先深呼吸...',
    '正在比對你的藉口與現實落差...',
    '載入中：逃避現實雷達 v2.0...',
    '偵測到高濃度自我催眠訊號...',
    'AI 確認：這不是人生難題，是又想逃...',
    '正在模擬你事後心裡的 OS...',
    '分析進度：90% 看破，10% 替你留面子...',
    'AI 正在整理你的社死 plus 預告...',
  ],
  salaryman: [
    '正在同步你的出勤焦慮...',
    '偵測到「不想上班但想領薪水」矛盾...',
    '正在比對你的年假與精神狀態...',
    'AI 發現主管出現在噩夢頻率偏高...',
    '正在計算離職衝動 vs 房貸壓力...',
    '載入中：假裝在忙的技能樹...',
    '正在分析你的會議耐受度...',
    '偵測到週日下午憂鬱峰值...',
    'AI 確認：你的問題 80% 跟上班有關...',
    '正在估算本週還能摸魚幾次...',
    '同步中：全公司同事的倦怠曲線...',
    'AI 提醒：明天鬧鐘仍然存在...',
  ],
  lovebrain: [
    '正在掃描你的暈船雷達...',
    'AI 發現對方已讀不回第 3 次...',
    '正在分析「他其實有意思吧？」機率...',
    '載入中：曖昧解讀過度分析模組...',
    '偵測到深夜想傳訊息衝動...',
    '正在比對你的心跳與理智剩餘...',
    'AI 發現你把普通對待當成特別...',
    '正在模擬告白成功與社死兩種結局...',
    '同步中：前任社交動態...',
    '偵測到戀愛腦濃度超標...',
    'AI 正在解讀一個「嗯」的 17 種意思...',
    '正在計算暈船沉沒機率...',
  ],
  zen: [
    '正在放下對答案的執著...',
    'AI 深呼吸中，請你也深呼吸...',
    '正在觀察你的糾結，但不評判（假的）...',
    '偵測到：萬事皆空，除了你的煩惱...',
    '正在同步「隨緣」與「不甘心」的拉扯...',
    'AI 確認：這也會過去，包括你的尊嚴...',
    '正在計算執著程度與睡眠品質...',
    '載入中：無為而治但還是要給建議...',
    '正在分析你的「算了」是真算還是假算...',
    'AI 發現你嘴上说隨緣，心裡很在意...',
    '正在連接佛系通道，訊號略帶無奈...',
    '偵測到紅塵未了，問題先到了...',
  ],
  guilt: [
    '正在載入「為你好」語錄包...',
    'AI 發現你最近讓很多人操心...',
    '正在分析你的選擇會影響誰...',
    '偵測到「大家都這麼努力了」訊號...',
    'AI 正在回憶你說過的「下次一定」...',
    '正在計算讓家人失望的可能性...',
    '同步中：關心你的人的擔心指數...',
    'AI 確認：你不是不能選，是不敢承擔...',
    '正在模擬「如果你不做會怎樣」場景...',
    '偵測到經典「我為你付出這麼多」迴圈...',
    '正在整理溫柔但刺的情勒語句...',
    'AI 想問：你這樣真的對得起自己嗎？',
  ],
}

export const PERSONALITY_DISCLAIMERS: Record<PersonalityId, string[]> = {
  normal: [
    '本結果不具任何人生參考價值。',
    'AI 已盡力，剩下的靠你自己。',
    '平行宇宙的你也很後悔。',
    '本系統已對你感到疲憊。',
  ],
  hell: [
    '本報告殘忍但無害，請勿對號入座到想不開。',
    'AI 嘴硬心軟，罵完記得照顧自己。',
    '如果看哭了，建議先喝杯水。',
    '地獄模式：只燙嘴，不傷人。',
  ],
  hellspicy: [
    '地獄加辣：更狠但仍是你朋友，看完記得喝水。',
    '本報告辣度偏高，不建議轉發給主管。',
    '如果被戳到，代表 AI 可能說對了。',
    '加辣不加恨，嘴完還是會擔心你。',
  ],
  salaryman: [
    '本報告不能當離職證明使用。',
    '明天鬧鐘不會因為這份報告消失。',
    '摸魚請適度，被抓到 AI 不負責。',
    '社畜 AI 也在等放假，互相理解。',
  ],
  lovebrain: [
    '本報告不能代替對方回覆你訊息。',
    '暈船時請記得理智可能還在岸上。',
    'AI 不支持凌晨三點傳「你在嗎」。',
    '愛情沒有標準答案，但已讀不回通常是答案。',
  ],
  zen: [
    '隨緣看報告，也隨緣做決定。',
    '一切會過去，包括這行小字。',
    'AI 已放下，你可以慢慢來。',
    '本報告如夢幻泡影，如露亦如電。',
  ],
  guilt: [
    '本情勒純屬娛樂，請勿轉發給媽媽。',
    'AI 關心你，但沒有要控制你的人生。',
    '如果覺得被戳到，可能代表該想想了。',
    '情勒完記得給自己一個擁抱（可選）。',
  ],
}

export function getPersonality(id: PersonalityId): Personality {
  return PERSONALITIES.find((p) => p.id === id) ?? PERSONALITIES[0]
}

function shuffle<T>(items: T[]): T[] {
  const pool = [...items]
  for (let i = pool.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }
  return pool
}

export function pickLoadingMessages(
  personalityId: PersonalityId,
  progressMs = 6000,
  intervalMs = 1000,
): string[] {
  const pool = PERSONALITY_LOADING_MESSAGES[personalityId]
  const count = Math.ceil(progressMs / intervalMs)
  const shuffled = shuffle(pool)
  const messages: string[] = []

  for (let i = 0; i < count; i += 1) {
    messages.push(shuffled[i % shuffled.length])
  }

  return messages
}
