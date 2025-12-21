console.log("[CS] Content script file loaded");

import { injector } from "../calculator/injector";
import "./content.scss";

let abortController: AbortController | undefined = undefined;

async function handleRouteChange(url: string) {
  console.log("[CS] Route changed:", url);
  abortController = (await injector(url, abortController)) ?? undefined;
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
