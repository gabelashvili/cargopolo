import { calculatorSection } from './calculator'
import type { SectionConfig } from './types'

// Register all sections here
export const sections: SectionConfig[] = [calculatorSection]

// Export for use in other modules
export type { SectionConfig } from './types'
