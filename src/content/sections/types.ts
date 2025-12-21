import type { ReactNode } from "react";
import type { Auction } from "../../types/common";

/**
 * Defines a target element where a section can be injected
 */
export interface TargetConfig {
  selector: string;
  insertPosition: "before" | "after" | "prepend" | "append"; // added full options
}

/**
 * Defines a single section to be injected
 */
export interface SectionConfigItem {
  id: string;
  name: string;
  target: TargetConfig; // allow multiple targets
  component: () => ReactNode;
}

/**
 * Defines all sections per auction type
 */
export type SectionConfig = Record<Auction, SectionConfigItem[]>;
