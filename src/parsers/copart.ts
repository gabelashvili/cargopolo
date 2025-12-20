import type { LotDetails } from '../types/common'

// Copart URL patterns - support both /lot/ and /vehicle/ paths
const COPART_LOT_URL_PATTERN = /^https:\/\/[^/]*\.?copart\.com\/(lot|vehicle)\/\d+\/[^/?#]*/
const COPART_DOMAIN_PATTERN = /copart\.com/

export function isCopartLotUrl(url: string) {
  return COPART_LOT_URL_PATTERN.test(url)
}

export function isCopartDomain(url: string) {
  return COPART_DOMAIN_PATTERN.test(url)
}

export function parseCopart(body: string): LotDetails | null {
  try {
    const match = body.match(/cachedSolrLotDetailsStr:\s*"((?:\\.|[^"])*)"/)
    if (!match) {
      console.warn('[Cargopolo] Could not extract cachedSolrLotDetailsStr')
      return null
    }

    const data = JSON.parse(match[1].replace(/\\"/g, '"').replace(/\\\\/g, '\\'))

    return {
      auction: 'copart',
      saleCity: data.yn.split('-')[1].trim(),
      saleState: data.yn.split('-')[0].trim(),
      releaseYear: parseInt(data.lcy),
      engineInformation: data.egn,
    }
  } catch (error) {
    console.error('[Cargopolo] Failed to parse Copart lot details:', error)
    return null
  }
}
