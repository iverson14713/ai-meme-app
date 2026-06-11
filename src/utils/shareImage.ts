import { Directory, Filesystem } from '@capacitor/filesystem'
import { Share } from '@capacitor/share'
import { toPng } from 'html-to-image'
import { isNativeApp } from '../platform/runtime'
import { ensureShareImagesReady } from '../share/shareLogo'

export async function generateShareImage(node: HTMLElement): Promise<string> {
  await ensureShareImagesReady(node)

  return toPng(node, {
    cacheBust: false,
    pixelRatio: 3,
    backgroundColor: '#050508',
  })
}

export function getShareImageButtonLabel(): string {
  return isNativeApp() ? '分享圖片' : '下載圖片'
}

function defaultShareFilename(): string {
  return `ai-mouthy-share-${Date.now()}.png`
}

function dataUrlToBase64(dataUrl: string): string {
  const commaIndex = dataUrl.indexOf(',')
  if (commaIndex === -1) {
    throw new Error('分享圖格式錯誤')
  }
  return dataUrl.slice(commaIndex + 1)
}

function isShareCancelled(error: unknown): boolean {
  if (!(error instanceof Error)) return false
  const message = error.message.toLowerCase()
  return (
    message.includes('cancel') ||
    message.includes('canceled') ||
    message.includes('cancelled') ||
    message.includes('dismiss')
  )
}

function shareDeliveryErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }
  return isNativeApp() ? '分享失敗，請再試一次' : '下載失敗，請再試一次'
}

export function downloadShareImage(dataUrl: string, filename?: string) {
  const link = document.createElement('a')
  link.download = filename ?? defaultShareFilename()
  link.href = dataUrl
  link.click()
}

async function shareImageNative(dataUrl: string, filename: string): Promise<void> {
  const { uri } = await Filesystem.writeFile({
    path: filename,
    data: dataUrlToBase64(dataUrl),
    directory: Directory.Cache,
  })

  const { value: canShare } = await Share.canShare()
  if (!canShare) {
    throw new Error('此裝置不支援分享')
  }

  await Share.share({
    files: [uri],
    dialogTitle: '分享 AI有點嘴',
  })
}

export async function shareOrDownloadImage(
  dataUrl: string,
  filename?: string,
): Promise<void> {
  const resolvedFilename = filename ?? defaultShareFilename()

  if (isNativeApp()) {
    try {
      await shareImageNative(dataUrl, resolvedFilename)
    } catch (error) {
      if (isShareCancelled(error)) return
      throw new Error(shareDeliveryErrorMessage(error))
    }
    return
  }

  try {
    downloadShareImage(dataUrl, resolvedFilename)
  } catch (error) {
    throw new Error(shareDeliveryErrorMessage(error))
  }
}
