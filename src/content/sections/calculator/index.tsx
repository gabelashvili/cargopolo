import Calculator from "../../../calculator/components/Calculator";
import type { SectionConfig } from "../types";

export const calculatorSection: SectionConfig = {
  id: "cargopolo-calculator",
  name: "Calculator",
  targetSelector: ".bid-information-section.cprt-panel",
  insertPosition: "before",
  component: () => <Calculator />,
};
