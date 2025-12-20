import { calculatorSection } from './calculator'
import { finderSection } from './finder'
import type { SectionConfig } from './types'

// Register all sections here
export const sections: SectionConfig[] = [calculatorSection, finderSection]

// Export for use in other modules
export type { SectionConfig } from './types'
