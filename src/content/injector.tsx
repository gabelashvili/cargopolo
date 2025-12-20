import React from 'react'
import ReactDOM from 'react-dom/client'
import type { SectionConfig } from './sections/types'

const injectedSections = new Set<string>()

// Get the CSS URL from the extension
const cssUrl = chrome.runtime.getURL('assets/content.css')

function insertElement(container: HTMLElement, target: Element, position: SectionConfig['insertPosition']) {
  switch (position) {
    case 'before':
      target.parentNode?.insertBefore(container, target)
      break
    case 'after':
      target.parentNode?.insertBefore(container, target.nextSibling)
      break
    case 'prepend':
      target.insertBefore(container, target.firstChild)
      break
    case 'append':
      target.appendChild(container)
      break
  }
}

export function injectSection(section: SectionConfig): boolean {
  const rootId = `${section.id}-root`

  // Check if already injected
  if (injectedSections.has(section.id) || document.getElementById(rootId)) {
    console.log(`[Cargopolo] Section "${section.name}" already injected`)
    return true
  }

  // Find target element
  const targetElement = document.querySelector(section.targetSelector)
  if (!targetElement) {
    console.log(`[Cargopolo] Target for "${section.name}" not found: ${section.targetSelector}`)
    return false
  }

  // Create container with Shadow DOM
  const container = document.createElement('div')
  container.id = rootId
  container.setAttribute('data-section', section.id)

  // Create shadow root for style isolation
  const shadowRoot = container.attachShadow({ mode: 'open' })

  // Inject styles into shadow DOM
  const styleLink = document.createElement('link')
  styleLink.rel = 'stylesheet'
  styleLink.href = cssUrl
  shadowRoot.appendChild(styleLink)

  // Create mount point inside shadow DOM
  const mountPoint = document.createElement('div')
  mountPoint.className = 'cargopolo-shadow-root'
  shadowRoot.appendChild(mountPoint)

  // Insert at correct position
  insertElement(container, targetElement, section.insertPosition)

  // Mount React component into shadow DOM
  ReactDOM.createRoot(mountPoint).render(<React.StrictMode>{section.component()}</React.StrictMode>)

  injectedSections.add(section.id)
  console.log(`[Cargopolo] Section "${section.name}" injected with Shadow DOM!`)
  return true
}

export function injectSections(sections: SectionConfig[]): void {
  const pendingSections = sections.filter(section => !injectSection(section))

  if (pendingSections.length === 0) {
    console.log('[Cargopolo] All sections injected!')
    return
  }

  // Observe DOM for pending sections
  console.log(`[Cargopolo] Waiting for ${pendingSections.length} section(s)...`)

  const observer = new MutationObserver(() => {
    const stillPending = pendingSections.filter(section => !injectSection(section))

    if (stillPending.length === 0) {
      observer.disconnect()
      console.log('[Cargopolo] All sections injected!')
    }
  })

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  })

  // Timeout after 30 seconds
  setTimeout(() => {
    observer.disconnect()
    const failed = pendingSections.filter(s => !injectedSections.has(s.id))
    if (failed.length > 0) {
      console.log(`[Cargopolo] Timeout: Could not find targets for: ${failed.map(s => s.name).join(', ')}`)
    }
  }, 30000)
}
