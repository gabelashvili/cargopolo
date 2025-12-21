chrome.webNavigation.onHistoryStateUpdated.addListener((details) => {
  if (details.frameId !== 0) return;

  console.log("[BG] SPA navigation:", details.url);

  chrome.tabs.sendMessage(details.tabId, {
    type: "URL_CHANGED",
    url: details.url,
  });
});

chrome.webNavigation.onCommitted.addListener((details) => {
  if (details.frameId !== 0) return;

  console.log("[BG] Navigation committed:", details.url);

  chrome.tabs.sendMessage(details.tabId, {
    type: "URL_CHANGED",
    url: details.url,
  });
});
