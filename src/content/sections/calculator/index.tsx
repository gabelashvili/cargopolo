import Calculator from "../../../calculator/components/Calculator";
import type { SectionConfig, SectionConfigItem } from "../types";

export const calculatorSection: SectionConfigItem = {
  id: "cargopolo-calculator",
  name: "Calculator",
  targets: {
    iaai: {
      selector: ".bid-information-section.cprt-panel",
      insertPosition: "before",
    },
    copart: {
      selector: "#vdActionInfo",
      insertPosition: "before",
    },
  },
  component: () => <Calculator />,
};
