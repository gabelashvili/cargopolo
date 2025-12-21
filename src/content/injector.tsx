import { createRoot, type Root } from "react-dom/client";
import type { SectionConfig, TargetConfig } from "./sections/types";

/* ----------------------------------------------------
   State
---------------------------------------------------- */

const injectedRoots = new Map<string, HTMLElement>();
const pendingSections = new Set<SectionConfig>();
let batchScheduled = false;

/* ----------------------------------------------------
   Utils
---------------------------------------------------- */

function insertElement(
  targetElement: Element,
  insertPosition: TargetConfig["insertPosition"],
  elementToInsert: HTMLElement,
) {
  switch (insertPosition) {
    case "before":
      targetElement.parentNode?.insertBefore(elementToInsert, targetElement);
      break;
    case "after":
      targetElement.parentNode?.insertBefore(elementToInsert, targetElement.nextSibling);
      break;
    case "prepend":
      targetElement.insertBefore(elementToInsert, targetElement.firstChild);
      break;
    case "append":
      targetElement.appendChild(elementToInsert);
      break;
  }
}

function waitForElement(selector: string, root: ParentNode = document, timeout = 10000): Promise<Element> {
  return new Promise((resolve, reject) => {
    const existing = root.querySelector(selector);
    if (existing) return resolve(existing);

    const observer = new MutationObserver(() => {
      const el = root.querySelector(selector);
      if (el) {
        observer.disconnect();
        resolve(el);
      }
    });

    observer.observe(root, { childList: true, subtree: true });

    setTimeout(() => {
      observer.disconnect();
      reject();
    }, timeout);
  });
}

/* ----------------------------------------------------
   Strong Shadow DOM isolation
---------------------------------------------------- */

function createIsolatedShadow(root: HTMLElement) {
  const shadow = root.attachShadow({ mode: "open" });

  // CSS reset
  const reset = new CSSStyleSheet();
  reset.replaceSync(`
    :host {
      all: initial;
      contain: layout style;
    }
  `);

  shadow.adoptedStyleSheets = [reset];
  return shadow;
}

/* ----------------------------------------------------
   Injection
---------------------------------------------------- */

async function injectAtTarget(section: SectionConfig, target: TargetConfig, index: number): Promise<boolean> {
  let targetEl: Element;

  try {
    targetEl = await waitForElement(target.selector);
  } catch {
    return false;
  }

  const rootId = `${section.id}-root-${index}`;
  if (injectedRoots.has(rootId)) return true;

  const host = document.createElement("div");
  host.id = rootId;
  host.dataset.cargopolo = "true";

  insertElement(targetEl, target.insertPosition, host);

  const shadow = createIsolatedShadow(host);

  const container = document.createElement("div");
  shadow.appendChild(container);

  const css = document.createElement("link");
  css.rel = "stylesheet";
  css.href = chrome.runtime.getURL("assets/content.css");
  shadow.appendChild(css);

  const reactRoot: Root = createRoot(container);

  const render = () => reactRoot.render(section.component());

  css.onload = render;
  css.onerror = render;

  injectedRoots.set(rootId, host);

  observeCleanup(rootId, target.selector);

  return true;
}

/* ----------------------------------------------------
   Cleanup when target disappears
---------------------------------------------------- */

function observeCleanup(rootId: string, selector: string) {
  const observer = new MutationObserver(() => {
    const targetExists = document.querySelector(selector);
    if (!targetExists) {
      injectedRoots.get(rootId)?.remove();
      injectedRoots.delete(rootId);
      observer.disconnect();
    }
  });

  observer.observe(document.body, {
    childList: true,
    subtree: true,
  });
}

/* ----------------------------------------------------
   Batch injection
---------------------------------------------------- */

function scheduleBatchInjection() {
  if (batchScheduled) return;
  batchScheduled = true;

  queueMicrotask(async () => {
    for (const section of pendingSections) {
      await injectSection(section);
    }
    pendingSections.clear();
    batchScheduled = false;
  });
}

/* ----------------------------------------------------
   Public API
---------------------------------------------------- */

export function requestInjection(section: SectionConfig) {
  pendingSections.add(section);
  scheduleBatchInjection();
}

export async function injectSection(section: SectionConfig) {
  const targets = Array.isArray(section.targets) ? section.targets : [section.targets];

  await Promise.all(targets.map((t, i) => injectAtTarget(section, t, i)));
}

/* ----------------------------------------------------
   SPA Route Change Detection
---------------------------------------------------- */

function patchHistory(fn: "pushState" | "replaceState") {
  const original = history[fn];
  history[fn] = function (...args) {
    const result = original.apply(this, args as any);
    window.dispatchEvent(new Event("cargopolo:route-change"));
    return result;
  };
}

export function enableSPARouteReinjection(sections: SectionConfig[]) {
  patchHistory("pushState");
  patchHistory("replaceState");

  window.addEventListener("popstate", () => {
    window.dispatchEvent(new Event("cargopolo:route-change"));
  });

  window.addEventListener("cargopolo:route-change", () => {
    sections.forEach(requestInjection);
  });
}
