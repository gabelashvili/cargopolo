import { calculatorSection } from "./calculator";
import { finderSection } from "./finder";
import type { SectionConfig } from "./types";

// Register all sections here
export const sections = {
  iaai: [calculatorSection, finderSection],
  copart: [calculatorSection, finderSection],
} satisfies SectionConfig;

// Export for use in other modules
export type { SectionConfig } from "./types";
