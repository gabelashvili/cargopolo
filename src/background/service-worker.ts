// Service Worker for Cargopolo Calculator Extension

console.log('[Cargopolo] Service Worker initialized')

// Install event
chrome.runtime.onInstalled.addListener(details => {
  console.log('[Cargopolo] Extension installed/updated:', details.reason)

  if (details.reason === 'install') {
    console.log('[Cargopolo] First time installation')
  } else if (details.reason === 'update') {
    console.log('[Cargopolo] Extension updated')
  }
})

// Handle messages from content scripts or popup
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('[Cargopolo] Message received:', message)

  // Handle different message types
  switch (message.type) {
    case 'ping':
      sendResponse({ success: true, message: 'pong' })
      break
    case 'LOT_DETAILS_PARSED':
      // Content script parsed lot details, can store or process here
      console.log('[Cargopolo] Lot details parsed:', message.data)
      sendResponse({ success: true })
      break
    default:
      sendResponse({ success: false, message: 'Unknown message type' })
  }

  return true // Keep the message channel open for async response
})

// Handle extension icon click (if you add a popup later)
chrome.action.onClicked.addListener(tab => {
  console.log('[Cargopolo] Extension icon clicked on tab:', tab.id)
  // You can add logic here to open a popup or perform actions
})
