import type { Project } from '../database/schema'

declare module 'h3' {
  interface H3EventContext {
    isAdmin: boolean
    projectId: string | null
    project?: Project
    userId?: string
  }
}

export {}
