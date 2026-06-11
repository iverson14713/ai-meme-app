export type UpgradeRoastTier = 'mild' | 'medium' | 'hell' | 'ultra'

export type UpgradeRoastPick = {
  text: string
  tier: UpgradeRoastTier
}

export const UPGRADE_ROAST_ULTRA_CHANCE = 0.05

export const randomUpgradeRoastTexts: Record<UpgradeRoastTier, string[]> = {
  mild: [
    '人類又準備亂花錢了。',
    '你的錢包正在瑟瑟發抖。',
    '等等，你真的要買？',
    'AI 良心突然發作。',
    '這筆錢拿去買珍奶可能比較實在。',
    'PRO 不能保證人生好過，但可以嘴更多次。',
    '你確定不是衝動消費？',
    '本 AI 先幫你的錢包默哀三秒。',
    '升級之前，深呼吸一下。',
    '你的決策歷史讓 AI 有點擔心。',
  ],
  medium: [
    '又一位被嘴到願意付費的人類。',
    '恭喜，你快要為吐槽買單了。',
    '本 AI 沒想到真的有人願意付費。',
    '你的錢包比你的決策更有價值。',
    '被嘴到想付錢，這很人類。',
    '免費的嘴不夠，還要加購進階版？',
    '你以為 PRO 會讓人生好過？天真。',
    'AI 判定：你是被吐槽打動的那種人。',
    '付費解鎖的不是智慧，是更多嘴砲。',
    '你的錢包正在開啟防禦模式。',
    '這不是投資，這是情緒消費。',
    'AI 沒有在推銷，是你自己走進來的。',
  ],
  hell: [
    '恭喜，你準備用錢換更多羞辱。',
    '你的財務判斷力，跟你的問題一樣需要 PRO。',
    '花錢買 AI 繼續嘴你，這邏輯很人類。',
    '錢包：我又要替主人的衝動買單了。',
    '你不是需要 PRO，你是需要被嘴到服。',
    '這筆錢留著吃飯比較實際，但你開心就好。',
    'AI 建議：先存錢。但你應該不會聽。',
    '付費版只保證嘴更多，不保證你變聰明。',
    '你的消費習慣，比你的問題更離譜。',
    '升級 PRO 不會讓前任回來，記得。',
    '地獄級嘴砲已排隊，就等你刷卡。',
    '你付費的動機，AI 已記錄在案。',
  ],
  ultra: [
    '【超稀有】宇宙級冤大頭認證中…',
    '【超稀有】AI 沉默三秒：你真的要？',
    '【超稀有】你的錢包發出最後一聲悲鳴。',
    '【超稀有】本系統沒想到有人付費接嘴。',
    '【超稀有】恭喜解鎖：付費被 AI 看不起。',
    '【超稀有】這筆錢夠你買很多後悔了。',
    '【超稀有】AI 已將你列入「自願被嘴」名單。',
  ],
}

function pickFromPool(tier: UpgradeRoastTier): string {
  const pool = randomUpgradeRoastTexts[tier]
  return pool[Math.floor(Math.random() * pool.length)]
}

export function pickRandomUpgradeRoast(): UpgradeRoastPick {
  if (Math.random() < UPGRADE_ROAST_ULTRA_CHANCE) {
    return { text: pickFromPool('ultra'), tier: 'ultra' }
  }

  const tierRoll = Math.random()
  const tier: UpgradeRoastTier =
    tierRoll < 0.34 ? 'mild' : tierRoll < 0.67 ? 'medium' : 'hell'

  return { text: pickFromPool(tier), tier }
}
