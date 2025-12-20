import Calculator from '../../../calculator/components/Calculator'
import type { SectionConfig } from '../types'

export const calculatorSection: SectionConfig = {
  id: 'cargopolo-calculator',
  name: 'Calculator',
  targets: [
    {
      selector: '.bid-information-section.cprt-panel',
      insertPosition: 'before',
    },
    {
      selector: '#vdActionInfo',
      insertPosition: 'before',
    },
    // Add more targets as needed
    // {
    //   selector: '.another-selector',
    //   insertPosition: 'after',
    // },
  ],
  component: () => <Calculator />,
}
