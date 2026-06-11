export const ONBOARDING_TOAST_MESSAGES = [
  'AI 已收到放棄治療申請。',
  '祝你好運，人類。',
  '本系統不負責善後。',
  '願量子與你同在。',
  '後悔還來得及。',
] as const

export function pickOnboardingToastMessage(): string {
  return ONBOARDING_TOAST_MESSAGES[
    Math.floor(Math.random() * ONBOARDING_TOAST_MESSAGES.length)
  ]
}
