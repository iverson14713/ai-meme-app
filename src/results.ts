import type { PersonalityId } from './personalities'
import { pickPersonalityVerdict } from './personalityResults'

export type QuestionCategory =
  | 'work'
  | 'love'
  | 'food'
  | 'investment'
  | 'general'

export type AnalysisResult = {
  category: QuestionCategory
  verdict: string
  stats: [
    { label: string; value: number },
    { label: string; value: number },
    { label: string; value: number },
  ]
}

type ResultTemplate = {
  verdict: string
  stats: [
    { label: string; value: number },
    { label: string; value: number },
    { label: string; value: number },
  ]
}

const CATEGORY_KEYWORDS: { category: QuestionCategory; keywords: string[] }[] =
  [
    {
      category: 'work',
      keywords: ['離職', '上班', '主管', '請假', '工作'],
    },
    {
      category: 'love',
      keywords: ['告白', '前任', '曖昧', '訊息', '分手'],
    },
    {
      category: 'food',
      keywords: ['吃', '減肥', '宵夜', '珍奶', '雞排'],
    },
    {
      category: 'investment',
      keywords: ['股票', '比特幣', '買幣', '投資', '加倉'],
    },
  ]

const RESULT_TEMPLATES: Record<QuestionCategory, ResultTemplate[]> = {
  work: [
    {
      verdict: '你只是想逃避上班，離職證明不了你的勇敢。',
      stats: [
        { label: '後悔離職率', value: 87 },
        { label: '主管厭惡指數', value: 92 },
        { label: '摸魚渴望值', value: 98 },
      ],
    },
    {
      verdict: '量子演算法判定：問題不在公司，在你鬧鐘。',
      stats: [
        { label: '起床痛苦度', value: 94 },
        { label: '薪水不滿指數', value: 81 },
        { label: '幻想創業率', value: 73 },
      ],
    },
    {
      verdict: '請假不會讓人生好轉，只會讓待辦事項變多。',
      stats: [
        { label: '假條成功率', value: 66 },
        { label: '請假內疚值', value: 88 },
        { label: '補班地獄率', value: 91 },
      ],
    },
    {
      verdict: '你討厭的不是主管，是有人管你這件事。',
      stats: [
        { label: '主管順眼度', value: 3 },
        { label: '被念耐受值', value: 12 },
        { label: '反骨能量', value: 96 },
      ],
    },
    {
      verdict: '離職信在草稿箱躺三個月了，你只是想找個人推你一把。',
      stats: [
        { label: '拖延離職率', value: 89 },
        { label: '衝動辭職率', value: 45 },
        { label: '存款安全感', value: 7 },
      ],
    },
    {
      verdict: '工作讓你痛苦，但沒工作會讓你更痛苦，這就是現實。',
      stats: [
        { label: '職場倦怠度', value: 93 },
        { label: '裸辭後悔率', value: 85 },
        { label: '再就業難度', value: 72 },
      ],
    },
    {
      verdict: '你不是想換工作，你是想換一個不用工作的自己。',
      stats: [
        { label: '打工魂殘值', value: 4 },
        { label: '中樂透幻想率', value: 99 },
        { label: '履歷更新率', value: 11 },
      ],
    },
    {
      verdict: '週一早上問這個問題，答案已經很明顯了。',
      stats: [
        { label: '週一厭世值', value: 97 },
        { label: '咖啡依賴度', value: 88 },
        { label: '離職衝動值', value: 83 },
      ],
    },
  ],
  love: [
    {
      verdict: '你不是想告白，你是想確認對方也喜歡你。',
      stats: [
        { label: '被拒絕率', value: 62 },
        { label: '自作多情指數', value: 78 },
        { label: '勇氣值', value: 23 },
      ],
    },
    {
      verdict: '前任不是忘不掉，是現任不夠好讓你忘。',
      stats: [
        { label: '懷舊濾鏡強度', value: 91 },
        { label: '複合衝動率', value: 67 },
        { label: '理智殘值', value: 8 },
      ],
    },
    {
      verdict: '曖昧這件事，拖越久越像你在免費當備胎。',
      stats: [
        { label: '備胎指數', value: 84 },
        { label: '曖昧疲勞度', value: 76 },
        { label: '被騙期待值', value: 89 },
      ],
    },
    {
      verdict: '已讀不回不是訊號問題，是對方在給你答案。',
      stats: [
        { label: '已讀不回率', value: 93 },
        { label: '秒回卑微度', value: 87 },
        { label: '自作多情值', value: 82 },
      ],
    },
    {
      verdict: '分手後想復合，通常是因為你忘了當初為什麼分。',
      stats: [
        { label: '失憶懷舊率', value: 88 },
        { label: '重蹈覆轍率', value: 79 },
        { label: '單身適應度', value: 15 },
      ],
    },
    {
      verdict: '你問的不是要不要告白，是能不能不要這麼丟臉。',
      stats: [
        { label: '社死預警率', value: 86 },
        { label: '臉皮厚度', value: 19 },
        { label: '成功機率', value: 31 },
      ],
    },
    {
      verdict: '量子戀愛分析：你在等對方先動，對方也在等，所以誰都沒動。',
      stats: [
        { label: '互相等待率', value: 95 },
        { label: '錯過機率', value: 91 },
        { label: '單身續約率', value: 88 },
      ],
    },
    {
      verdict: '訊息打又刪、刪又打，你的問題不在內容，在自信。',
      stats: [
        { label: '訊息修改次數', value: 99 },
        { label: '內耗指數', value: 94 },
        { label: '最終送出率', value: 22 },
      ],
    },
  ],
  food: [
    {
      verdict: '你不是餓，你是無聊。冰箱知道，你也知道。',
      stats: [
        { label: '假性飢餓率', value: 91 },
        { label: '嘴饞指數', value: 96 },
        { label: '意志力殘值', value: 5 },
      ],
    },
    {
      verdict: '減肥計畫從明天開始，這句話你已經說了三年。',
      stats: [
        { label: '明日再減率', value: 98 },
        { label: '體重反彈率', value: 83 },
        { label: '運動執行率', value: 4 },
      ],
    },
    {
      verdict: '宵夜是罪惡的，但不吃宵夜是更大的罪惡。',
      stats: [
        { label: '深夜破戒率', value: 89 },
        { label: '罪惡感指數', value: 72 },
        { label: '後悔吃率', value: 81 },
      ],
    },
    {
      verdict: '珍奶不是飲料，是你對人生最後的溫柔與背叛。',
      stats: [
        { label: '手搖成癮度', value: 94 },
        { label: '糖分超標率', value: 88 },
        { label: '再一杯機率', value: 97 },
      ],
    },
    {
      verdict: '雞排會消失，但後悔不會。不過你還是會買。',
      stats: [
        { label: '雞排誘惑力', value: 99 },
        { label: '排隊耐心值', value: 76 },
        { label: '熱量無視率', value: 92 },
      ],
    },
    {
      verdict: '你問要不要吃，其實心裡早就點好外送了。',
      stats: [
        { label: '假裝猶豫率', value: 87 },
        { label: '外送打開率', value: 93 },
        { label: '減肥放棄值', value: 86 },
      ],
    },
    {
      verdict: '減肥與吃之間，你選了兩邊都要，然後兩邊都輸。',
      stats: [
        { label: '左右為難率', value: 90 },
        { label: '自欺指數', value: 85 },
        { label: '體重上升率', value: 78 },
      ],
    },
    {
      verdict: 'AI 掃描結果：你的胃和腦在開戰，胃每次都贏。',
      stats: [
        { label: '大腦投降率', value: 96 },
        { label: '暴食衝動值', value: 88 },
        { label: '飽足感延遲', value: 74 },
      ],
    },
  ],
  investment: [
    {
      verdict: '你不是在投資，你是在用錢買一個致富的幻想。',
      stats: [
        { label: '韭菜指數', value: 93 },
        { label: '幻想暴富率', value: 97 },
        { label: '風險意識值', value: 6 },
      ],
    },
    {
      verdict: '加倉不會讓你翻本，只會讓你虧更多。',
      stats: [
        { label: '越跌越買率', value: 84 },
        { label: '攤平幻想值', value: 91 },
        { label: '止損執行率', value: 3 },
      ],
    },
    {
      verdict: '比特幣漲的時候你不在，跌的時候你全倉，這是定律。',
      stats: [
        { label: '踏空率', value: 88 },
        { label: '追高機率', value: 92 },
        { label: '時機掌握度', value: 2 },
      ],
    },
    {
      verdict: '股票不是問題，問題是你把運氣當實力。',
      stats: [
        { label: '過度自信值', value: 89 },
        { label: '運氣歸功率', value: 95 },
        { label: '虧損接受度', value: 11 },
      ],
    },
    {
      verdict: '買幣前請先問：這筆錢丟水裡你會不會哭。',
      stats: [
        { label: '可承受虧損率', value: 34 },
        { label: '衝動下單率', value: 87 },
        { label: '事後後悔值', value: 91 },
      ],
    },
    {
      verdict: '你研究的不是投資，是找理由說服自己all in。',
      stats: [
        { label: '自我說服力', value: 96 },
        { label: '基本面理解度', value: 14 },
        { label: 'FOMO 指數', value: 93 },
      ],
    },
    {
      verdict: '投資最重要的是心態，你的心態顯然還沒準備好。',
      stats: [
        { label: '心態穩定度', value: 7 },
        { label: '割韭菜機率', value: 86 },
        { label: '長期持有率', value: 19 },
      ],
    },
    {
      verdict: '平行宇宙的你已經財富自由，這個宇宙的你還在問要不要買。',
      stats: [
        { label: '平行宇宙差距', value: 99 },
        { label: '衝動交易率', value: 82 },
        { label: '理性殘值', value: 5 },
      ],
    },
  ],
  general: [
    {
      verdict: '你問的不是問題，是找一個可以行動的藉口。',
      stats: [
        { label: '藉口生成率', value: 91 },
        { label: '行動力殘值', value: 8 },
        { label: '後悔預測率', value: 84 },
      ],
    },
    {
      verdict: '量子演算法判定：你在找答案，但心裡早有決定了。',
      stats: [
        { label: '假裝猶豫率', value: 88 },
        { label: '自我欺騙值', value: 86 },
        { label: '理智指數', value: 12 },
      ],
    },
    {
      verdict: '平行宇宙的你已經後悔了，這個宇宙建議你也先想想。',
      stats: [
        { label: '平行後悔率', value: 87 },
        { label: '衝動指數', value: 79 },
        { label: '冷靜殘值', value: 6 },
      ],
    },
    {
      verdict: '你不是需要 AI 建議，你需要一個推你一把的人。',
      stats: [
        { label: '決策拖延率', value: 92 },
        { label: '依賴他人度', value: 76 },
        { label: '自主判斷力', value: 15 },
      ],
    },
    {
      verdict: '深夜問人生問題的人，答案通常是：先去睡覺。',
      stats: [
        { label: '深夜衝動率', value: 94 },
        { label: '睡眠缺乏度', value: 81 },
        { label: '明天後悔率', value: 88 },
      ],
    },
    {
      verdict: '你的問題太抽象，AI 只能判定：你在焦慮。',
      stats: [
        { label: '焦慮指數', value: 93 },
        { label: '問題清晰度', value: 11 },
        { label: '瞎擔心率', value: 85 },
      ],
    },
    {
      verdict: '人生沒有標準答案，但你的選擇通常偏向後悔那個。',
      stats: [
        { label: '選錯機率', value: 78 },
        { label: '直覺準確度', value: 23 },
        { label: '事後諸葛率', value: 96 },
      ],
    },
    {
      verdict: '偵測到你在把簡單問題複雜化，這也是一種才華。',
      stats: [
        { label: '過度思考率', value: 90 },
        { label: '糾結指數', value: 87 },
        { label: '效率殘值', value: 9 },
      ],
    },
  ],
}

export function classifyQuestion(question: string): QuestionCategory {
  const text = question.trim()

  for (const { category, keywords } of CATEGORY_KEYWORDS) {
    if (keywords.some((keyword) => text.includes(keyword))) {
      return category
    }
  }

  return 'general'
}

export function pickResult(
  question: string,
  personalityId: PersonalityId = 'normal',
): AnalysisResult {
  const category = classifyQuestion(question)
  const templates = RESULT_TEMPLATES[category]
  const template = templates[Math.floor(Math.random() * templates.length)]

  return {
    category,
    verdict: pickPersonalityVerdict(personalityId, category),
    stats: template.stats,
  }
}
