import { isIaaiVehicleUrl, parseIaai } from './iaai'
import { isCopartLotUrl, parseCopart, isCopartDomain } from './copart'
import type { LotDetails } from '../types/common'

export async function parseLotDetails(url: string): Promise<LotDetails | null> {
  try {
    // For content script, use full document HTML (everything including and after body)
    if (typeof document !== 'undefined' && document.documentElement) {
      // Get full HTML including everything after body tag
      const fullHtml = document.documentElement.outerHTML

      if (isIaaiVehicleUrl(url)) {
        console.log('[Cargopolo] Parsing IAAI URL:', url)
        return parseIaai(fullHtml)
      }

      // For Copart, try parsing even if URL pattern doesn't match exactly
      // (in case of route changes or different URL formats)
      if (isCopartDomain(url)) {
        console.log('[Cargopolo] Parsing Copart URL:', url, 'Pattern match:', isCopartLotUrl(url))
        const result = parseCopart(fullHtml)
        if (result) {
          return result
        }
        // If parsing failed but we're on Copart domain, log for debugging
        if (isCopartLotUrl(url)) {
          console.warn('[Cargopolo] Copart URL matched pattern but parsing failed')
        }
      }
    }

    return null
  } catch (error) {
    console.error('[Cargopolo] Failed to fetch/parse lot details:', error)
    return null
  }
}
