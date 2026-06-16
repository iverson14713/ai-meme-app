export const PRO_PRODUCT_MONTHLY = 'ai_mouthy_pro_monthly'
export const PRO_PRODUCT_YEARLY = 'ai_mouthy_pro_yearly'

export const PRO_PRODUCT_IDS = [PRO_PRODUCT_MONTHLY, PRO_PRODUCT_YEARLY] as const

export type ProProductId = (typeof PRO_PRODUCT_IDS)[number]

export const PRO_FALLBACK_PRICES = {
  monthly: 'NT$30/月',
  yearly: 'NT$290/年',
} as const

export const PRO_PLAN_LABELS = {
  monthly: 'AI有點嘴 PRO 月費',
  yearly: 'AI有點嘴 PRO 年費',
} as const

export const WEB_UPGRADE_NOTE = 'iOS App 內可升級 PRO'
