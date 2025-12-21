console.log("[CS] Content script file loaded");

import "./content.scss";

function handleRouteChange(url: string) {
  console.log("[CS] Route changed:", url);
}

function init() {
  console.log("[CS] Initializing content script");
  handleRouteChange(location.href);
}

chrome.runtime.onMessage.addListener((message) => {
  console.log("[CS] Message received:", message);

  if (message.type === "URL_CHANGED") {
    handleRouteChange(message.url);
  }
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
