import React from 'react'
import ReactDOM from 'react-dom/client'
import type { SectionConfig, TargetConfig } from './sections/types'

const injectedSections = new Set<string>()

// Get the CSS URL from the extension
const cssUrl = chrome.runtime.getURL('assets/content.css')

function insertElement(container: HTMLElement, target: Element, position: TargetConfig['insertPosition']) {
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

function injectSectionAtTarget(
  section: SectionConfig,
  target: { selector: string; insertPosition: 'before' | 'after' | 'prepend' | 'append' },
  instanceIndex: number
): boolean {
  const rootId = `${section.id}-root${instanceIndex > 0 ? `-${instanceIndex}` : ''}`

  // Check if already injected at this target
  if (document.getElementById(rootId)) {
    return true
  }

  // Find target element
  const targetElement = document.querySelector(target.selector)
  if (!targetElement) {
    return false
  }

  // Create container with Shadow DOM
  const container = document.createElement('div')
  container.id = rootId
  container.setAttribute('data-section', section.id)
  container.setAttribute('data-instance', instanceIndex.toString())

  // Create shadow root for style isolation
  const shadowRoot = container.attachShadow({ mode: 'open' })

  // Create mount point inside shadow DOM
  const mountPoint = document.createElement('div')
  mountPoint.className = 'cargopolo-shadow-root'
  shadowRoot.appendChild(mountPoint)

  // Insert at correct position
  insertElement(container, targetElement, target.insertPosition)

  // Inject styles into shadow DOM and wait for CSS to load
  const styleLink = document.createElement('link')
  styleLink.rel = 'stylesheet'
  styleLink.href = cssUrl

  // Wait for CSS to load before rendering React component
  const handleStyleLoad = () => {
    // Mount React component into shadow DOM after CSS is loaded
    ReactDOM.createRoot(mountPoint).render(<React.StrictMode>{section.component()}</React.StrictMode>)
    console.log(`[Cargopolo] Section "${section.name}" injected at "${target.selector}" with Shadow DOM!`)
  }

  // Check if stylesheet is already loaded
  if (styleLink.sheet) {
    handleStyleLoad()
  } else {
    styleLink.addEventListener('load', handleStyleLoad)
    styleLink.addEventListener('error', () => {
      console.warn(`[Cargopolo] Failed to load CSS for "${section.name}", rendering anyway...`)
      handleStyleLoad()
    })
  }

  shadowRoot.appendChild(styleLink)

  return true
}

export function injectSection(section: SectionConfig): boolean {
  // Check if already injected
  if (injectedSections.has(section.id)) {
    console.log(`[Cargopolo] Section "${section.name}" already processed`)
    return true
  }

  const targets = Array.isArray(section.targets) ? section.targets : [section.targets]
  let allInjected = true
  let injectedCount = 0

  targets.forEach((target, index) => {
    if (injectSectionAtTarget(section, target, index)) {
      injectedCount++
    } else {
      allInjected = false
    }
  })

  if (injectedCount > 0) {
    injectedSections.add(section.id)
    console.log(`[Cargopolo] Section "${section.name}" injected at ${injectedCount}/${targets.length} target(s)`)
  } else {
    console.log(`[Cargopolo] No targets found for "${section.name}"`)
  }

  return allInjected
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
