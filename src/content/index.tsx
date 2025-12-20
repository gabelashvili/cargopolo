import { sections } from "./sections";
import { injectSections } from "./injector";
import "./content.scss";

// Initialize when DOM is ready
function init() {
  console.log("[Cargopolo] Initializing extension...");
  injectSections(sections);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
