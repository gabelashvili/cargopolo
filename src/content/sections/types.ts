import type { ReactNode } from 'react'

export interface SectionConfig {
  id: string
  name: string
  targetSelector: string
  insertPosition: 'before' | 'after' | 'prepend' | 'append'
  component: () => ReactNode
}

export interface SectionRegistry {
  [key: string]: SectionConfig
}
