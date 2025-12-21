import type { ReactNode } from "react";

export interface TargetConfig {
  selector: string;
  insertPosition: "beforebegin" | "afterbegin" | "beforeend" | "afterend";
}

export interface SectionConfig {
  id: string;
  name: string;
  targets: TargetConfig | TargetConfig[];
  component: () => ReactNode;
}
