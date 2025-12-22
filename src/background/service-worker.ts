async function sendUrlChangeMessage(tabId: number, url: string) {
  try {
    await chrome.tabs.sendMessage(tabId, {
      type: "URL_CHANGED",
      url: url,
    });
  } catch (error) {
    // Content script might not be ready yet, ignore the error
    // The content script will handle the URL change on its own initialization
    console.log("[BG] Could not send message to content script (may not be ready yet):", error);
  }
}

chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId !== 0) return;

  console.log("[BG] SPA navigation:", details.url);

  sendUrlChangeMessage(details.tabId, details.url);
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;

  console.log("[BG] Navigation committed:", details.url);

  sendUrlChangeMessage(details.tabId, details.url);
});
