// Finder section - placeholder for future implementation
import type { SectionConfig } from "../types";

// Placeholder component - replace with actual Finder component
const FinderPlaceholder = () => (
  <div style={{ padding: "20px", background: "#f0f0f0", borderRadius: "8px", margin: "10px 0" }}>
    <h3>Finder Section</h3>
    <p>This is a placeholder for the Finder feature.</p>
  </div>
);

export const finderSection: SectionConfig = {
  id: "cargopolo-finder",
  name: "Finder",
  targets: {
    selector: ".some-target-selector", // Update with actual selector
    insertPosition: "before",
  },
  component: () => <FinderPlaceholder />,
};
