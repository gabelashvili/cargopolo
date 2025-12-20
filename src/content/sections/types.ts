import type { ReactNode } from 'react'

export interface TargetConfig {
  selector: string
  insertPosition: 'before' | 'after' | 'prepend' | 'append'
}

export interface SectionConfig {
  id: string
  name: string
  targets: TargetConfig | TargetConfig[]
  component: () => ReactNode
}

export interface SectionRegistry {
  [key: string]: SectionConfig
}
