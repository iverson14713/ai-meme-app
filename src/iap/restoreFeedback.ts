import type { UsageSnapshot } from '../usage/planLimits'

export const PURCHASE_SUCCESS_MESSAGE = '已升級 PRO'
export const PURCHASE_CANCELLED_MESSAGE = '已取消購買'
export const RESTORE_SUCCESS_MESSAGE = '已恢復 PRO'
export const RESTORE_NOT_FOUND_MESSAGE = '找不到有效訂閱'

export function isSuccessFeedbackMessage(message: string): boolean {
  return (
    message === PURCHASE_SUCCESS_MESSAGE || message === RESTORE_SUCCESS_MESSAGE
  )
}

export function getRestoreFeedbackMessage(
  snapshot: UsageSnapshot,
  error?: string,
): string {
  if (error) return error
  if (snapshot.isPro) return RESTORE_SUCCESS_MESSAGE
  return RESTORE_NOT_FOUND_MESSAGE
}
