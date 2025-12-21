import { createRoot, type Root } from "react-dom/client";
import type { ReactNode } from "react";
import Calculator from "./components/Calculator";

export function matchAuctionUrl(url: string): "copart" | "iaai" | null {
  // Copart: /lot/{lotNumber}/...
  const copartPattern = /^https?:\/\/www\.copart\.com\/lot\/\d+\/.*$/;

  // IAAI: /VehicleDetail/{vehicleId}~US
  const iaaiPattern = /^https?:\/\/www\.iaai\.com\/VehicleDetail\/\d+~US$/;

  if (copartPattern.test(url)) return "copart";
  if (iaaiPattern.test(url)) return "iaai";
  return null;
}

export function injectReactBefore(component: () => ReactNode, targetElement: Element, id?: string) {
  // Create host container
  const host = document.createElement("div");
  if (id) host.id = id;

  if (id && document.getElementById(id)) {
    console.log(`[injectReactBefore] Already injected: ${id}`);
    return;
  }
  // Insert before target element
  targetElement.parentNode?.insertBefore(host, targetElement);

  // Create Shadow DOM
  const shadow = host.attachShadow({ mode: "open" });

  // Optional CSS reset
  const resetStyle = document.createElement("style");
  resetStyle.textContent = `
    :host { all: initial; display: block; }
  `;
  shadow.appendChild(resetStyle);

  // Include extension CSS
  const cssLink = document.createElement("link");
  cssLink.rel = "stylesheet";
  cssLink.href = chrome.runtime.getURL("assets/content.css");
  shadow.appendChild(cssLink);

  // Create container for React
  const container = document.createElement("div");
  shadow.appendChild(container);

  let reactRoot: Root | undefined;

  // Wait until CSS loads before rendering
  const renderReact = () => {
    if (!reactRoot) {
      reactRoot = createRoot(container);
      reactRoot.render(component());
    }
  };

  cssLink.addEventListener("load", renderReact);
  cssLink.addEventListener("error", () => {
    console.warn("[injectReactBefore] Failed to load CSS, rendering anyway");
    renderReact(); // render even if CSS fails
  });

  // If CSS is already loaded (cached), render immediately
  if ((cssLink.sheet as CSSStyleSheet)?.cssRules.length >= 0) {
    renderReact();
  }

  return;
}

export function tryFindElement(
  selector: string,
  maxAttempts = 10,
  interval = 600,
  abortController?: AbortController,
): { promise: Promise<Element | null>; controller: AbortController } {
  const controller = abortController ?? new AbortController();
  let attempts = 0;

  const promise = new Promise<Element | null>((resolve) => {
    const check = () => document.querySelector(selector);

    const intervalId = setInterval(() => {
      if (controller.signal.aborted) {
        clearInterval(intervalId);
        resolve(null);
        return;
      }

      attempts++;
      const el = check();
      if (el) {
        clearInterval(intervalId);
        resolve(el);
      } else if (attempts >= maxAttempts) {
        clearInterval(intervalId);
        resolve(null);
      }
    }, interval);

    // Immediate first check
    const el = check();
    console.log("[CP]: Checking element with selector", el, selector, document.querySelectorAll(selector));
    if (el) {
      clearInterval(intervalId);
      resolve(el);
    }
  });

  return { promise, controller };
}

export const injector = async (url: string, previousController?: AbortController) => {
  console.log("[CP]: Injecting calculator for", url);

  // Abort previous search
  if (previousController) {
    console.log("[CP]: Aborting previous controller");
    previousController.abort();
  }

  const auction = matchAuctionUrl(url);
  if (!auction) {
    console.error("[CP]: Invalid URL", url);
    return null;
  }
  const selector = auction === "iaai" ? "#vdActionInfo" : ".bid-information-section.cprt-panel";

  const { promise, controller } = tryFindElement(selector, undefined, undefined, previousController);
  console.log("[CP]: Promise:", promise, "Controller:", controller);
  try {
    const el = await promise;
    console.log("[CP]: Element:", el);
    if (el) {
      injectReactBefore(() => <Calculator />, el, "cargopolo-calculator-root");

      console.log("[CP]: Found element:", el);
      // TODO: inject your React component here
    } else {
      console.error("[CP]: Element not found after max attempts");
    }
  } catch (err) {
    console.error("[CP]: Failed to inject calculator", err);
  }

  return controller; // Return new controller so caller can abort next time
};
