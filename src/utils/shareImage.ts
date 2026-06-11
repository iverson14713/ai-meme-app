import { toPng } from 'html-to-image'
import { ensureShareImagesReady } from '../share/shareLogo'

export async function generateShareImage(node: HTMLElement): Promise<string> {
  await ensureShareImagesReady(node)

  return toPng(node, {
    cacheBust: false,
    pixelRatio: 3,
    backgroundColor: '#050508',
  })
}

export function downloadShareImage(dataUrl: string, filename?: string) {
  const link = document.createElement('a')
  link.download = filename ?? `ai-meme-${Date.now()}.png`
  link.href = dataUrl
  link.click()
}
