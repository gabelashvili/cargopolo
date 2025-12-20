import { sections } from './sections'
import { injectSections } from './injector'
import { parseLotDetails } from '../parsers'
import { isCopartDomain } from '../parsers/copart'
import { setLotDetails, getLotDetails } from './lot-details-store'
import type { LotDetails } from '../types/common'
import './content.scss'
let parseRetryInterval: number | null = null
let parseRetryCount = 0
let currentUrl = window.location.href
let domObserver: MutationObserver | null = null
let navigationObserver: MutationObserver | null = null
let lastParsedContent: string | null = null
const MAX_RETRY_COUNT = 50 // Try for ~50 seconds (1000ms intervals)
const RETRY_INTERVAL = 1000 // 1000ms between retries

// Clean up parsing state
function cleanupParsing() {
  if (parseRetryInterval !== null) {
    clearInterval(parseRetryInterval)
    parseRetryInterval = null
  }
  if (domObserver) {
    domObserver.disconnect()
    domObserver = null
  }
  if (navigationObserver) {
    navigationObserver.disconnect()
    navigationObserver = null
  }
  parseRetryCount = 0
  lastParsedContent = null
}

// Parse current page with retry mechanism for SSR pages
async function parseCurrentPage() {
  const url = window.location.href

  // Check if URL changed
  if (url !== currentUrl) {
    console.log('[Cargopolo] URL changed, cleaning up and re-parsing')
    cleanupParsing()
    setLotDetails(null) // Clear previous lot details
    currentUrl = url
  }

  // Check if URL is supported using parser validation
  const isIaai = url.includes('iaai.com')
  const isCopart = isCopartDomain(url)

  if (!isIaai && !isCopart) {
    setLotDetails(null) // Clear lot details if not on supported site
    return
  }

  console.log('[Cargopolo] Parsing page:', { url, isIaai, isCopart })

  const tryParse = async (): Promise<LotDetails | null> => {
    try {
      return await parseLotDetails(url)
    } catch (error) {
      console.error('[Cargopolo] Error parsing page:', error)
      return null
    }
  }

  // For Copart, check if content actually changed by looking at key elements
  if (isCopart) {
    const copartKeyElements = document.querySelector(
      '.bid-information-section.cprt-panel, #vdActionInfo, [data-unifiedid]'
    )
    const currentContentHash = copartKeyElements ? (copartKeyElements.textContent || '').slice(0, 100) : document.title

    // If content hasn't changed, don't re-parse
    if (lastParsedContent === currentContentHash && getLotDetails() !== null) {
      console.log('[Cargopolo] Copart content unchanged, skipping parse')
      return
    }

    lastParsedContent = currentContentHash
  }

  // Try immediately
  let lotDetails = await tryParse()

  if (lotDetails) {
    setLotDetails(lotDetails)
    console.log('[Cargopolo] Parsed lot details:', lotDetails)

    // Dispatch custom event on window and all shadow root containers
    window.dispatchEvent(
      new CustomEvent('cargopolo:lot-details', {
        detail: lotDetails,
      })
    )

    // Also dispatch on all shadow root containers
    document.querySelectorAll('[data-section]').forEach(container => {
      if (container.shadowRoot) {
        container.dispatchEvent(
          new CustomEvent('cargopolo:lot-details', {
            detail: lotDetails,
            bubbles: false,
          })
        )
      }
    })
    return
  }

  // If not found, retry with interval
  console.log('[Cargopolo] Lot details not found, retrying...')
  parseRetryCount = 0

  parseRetryInterval = window.setInterval(async () => {
    parseRetryCount++

    lotDetails = await tryParse()

    if (lotDetails) {
      setLotDetails(lotDetails)
      console.log('[Cargopolo] Parsed lot details (after retry):', lotDetails)

      // Clear retry interval
      if (parseRetryInterval !== null) {
        clearInterval(parseRetryInterval)
        parseRetryInterval = null
      }

      // Dispatch custom event on window and all shadow root containers
      window.dispatchEvent(
        new CustomEvent('cargopolo:lot-details', {
          detail: lotDetails,
        })
      )

      // Also dispatch on all shadow root containers
      document.querySelectorAll('[data-section]').forEach(container => {
        if (container.shadowRoot) {
          container.dispatchEvent(
            new CustomEvent('cargopolo:lot-details', {
              detail: lotDetails,
              bubbles: false,
            })
          )
        }
      })
    } else if (parseRetryCount >= MAX_RETRY_COUNT) {
      // Stop retrying after max attempts
      console.log('[Cargopolo] Max retry count reached, stopping parse attempts')
      if (parseRetryInterval !== null) {
        clearInterval(parseRetryInterval)
        parseRetryInterval = null
      }
    }
  }, RETRY_INTERVAL)

  // Also watch for DOM changes that might indicate SSR content loaded
  domObserver = new MutationObserver(async () => {
    if (!getLotDetails()) {
      lotDetails = await tryParse()
      if (lotDetails) {
        setLotDetails(lotDetails)
        console.log('[Cargopolo] Parsed lot details (from DOM mutation):', lotDetails)

        // Clear retry interval
        cleanupParsing()

        // Dispatch custom event on window and all shadow root containers
        window.dispatchEvent(
          new CustomEvent('cargopolo:lot-details', {
            detail: lotDetails,
          })
        )

        // Also dispatch on all shadow root containers
        document.querySelectorAll('[data-section]').forEach(container => {
          if (container.shadowRoot) {
            container.dispatchEvent(
              new CustomEvent('cargopolo:lot-details', {
                detail: lotDetails,
                bubbles: false,
              })
            )
          }
        })
      }
    } else {
      if (domObserver) {
        domObserver.disconnect()
        domObserver = null
      }
    }
  })

  domObserver.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Disconnect observer after timeout
  setTimeout(() => {
    if (domObserver) {
      domObserver.disconnect()
      domObserver = null
    }
  }, MAX_RETRY_COUNT * RETRY_INTERVAL)
}

// Initialize when DOM is ready
function init() {
  console.log('[Cargopolo] Initializing extension...')
  injectSections(sections)

  // Setup navigation listeners
  setupNavigationListener()

  // Parse current page (with retry mechanism)
  parseCurrentPage()
}

// Listen for navigation events (SPA route changes)
function setupNavigationListener() {
  // Listen for popstate (back/forward navigation)
  window.addEventListener('popstate', () => {
    console.log('[Cargopolo] Navigation detected (popstate)')
    setTimeout(() => parseCurrentPage(), 100) // Small delay to let DOM update
  })

  // Listen for hash changes
  window.addEventListener('hashchange', () => {
    console.log('[Cargopolo] Navigation detected (hashchange)')
    setTimeout(() => parseCurrentPage(), 100)
  })

  // Intercept pushState and replaceState for SPA navigation
  const originalPushState = history.pushState
  const originalReplaceState = history.replaceState

  history.pushState = function (...args) {
    originalPushState.apply(history, args)
    console.log('[Cargopolo] Navigation detected (pushState)')
    setTimeout(() => parseCurrentPage(), 100)
  }

  history.replaceState = function (...args) {
    originalReplaceState.apply(history, args)
    console.log('[Cargopolo] Navigation detected (replaceState)')
    setTimeout(() => parseCurrentPage(), 100)
  }

  // Watch for URL changes via polling (for Copart SPA navigation)
  let lastUrl = window.location.href
  let lastHash = window.location.hash
  const urlCheckInterval = setInterval(() => {
    const currentUrl = window.location.href
    const currentHash = window.location.hash

    if (currentUrl !== lastUrl || currentHash !== lastHash) {
      lastUrl = currentUrl
      lastHash = currentHash
      console.log('[Cargopolo] URL changed detected via polling:', currentUrl, currentHash)
      parseCurrentPage()
    }
  }, 200) // Check more frequently for Copart

  // Store interval ID for cleanup if needed
  ;(window as unknown as Record<string, unknown>).__cargopoloUrlCheckInterval = urlCheckInterval

  // Watch for DOM changes that indicate navigation (especially for Copart)
  if (isCopartDomain(window.location.href)) {
    setupCopartNavigationObserver()
  }
}

// Setup MutationObserver to detect Copart navigation via DOM changes
function setupCopartNavigationObserver() {
  // Watch for changes to key elements that indicate a new lot page
  const copartSelectors = [
    '.bid-information-section.cprt-panel',
    '#vdActionInfo',
    '[data-unifiedid]',
    '.lot-detail-header',
    '.vehicle-details',
  ]

  navigationObserver = new MutationObserver(mutations => {
    let shouldReparse = false

    for (const mutation of mutations) {
      // Check if key elements were added/removed
      if (mutation.type === 'childList') {
        for (const node of Array.from(mutation.addedNodes)) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as Element
            // Check if any of our target selectors appear
            for (const selector of copartSelectors) {
              if (element.matches?.(selector) || element.querySelector?.(selector)) {
                shouldReparse = true
                console.log('[Cargopolo] Copart key element detected:', selector)
                break
              }
            }
            if (shouldReparse) break
          }
        }
      }

      // Check if attributes changed on key elements (like data-unifiedid)
      if (mutation.type === 'attributes') {
        const target = mutation.target as Element
        if (target.matches?.('[data-unifiedid]') && mutation.attributeName === 'data-unifiedid') {
          shouldReparse = true
          console.log('[Cargopolo] Copart unified ID changed')
        }
      }
    }

    if (shouldReparse) {
      console.log('[Cargopolo] Copart navigation detected via DOM changes')
      // Debounce to avoid too many parse attempts
      setTimeout(() => {
        lastParsedContent = null // Force re-parse
        parseCurrentPage()
      }, 300)
    }
  })

  // Observe the document body for changes
  navigationObserver.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['data-unifiedid', 'id', 'class'],
  })

  console.log('[Cargopolo] Copart navigation observer setup complete')
}

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  cleanupParsing()
})

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}

// Re-export for use in sections
export { getLotDetails } from './lot-details-store'
