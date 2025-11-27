import { eq, or } from 'drizzle-orm'
import { projects } from '../database/schema'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const host = getRequestHeader(event, 'host') || ''
  const path = event.path || '/'

  // Skip for static assets and most API routes (but NOT /api/public)
  if (
    path.startsWith('/_nuxt') ||
    (path.startsWith('/api') && !path.startsWith('/api/public')) ||
    path.startsWith('/__nuxt') ||
    path.startsWith('/favicon')
  ) {
    return
  }

  // Check if this is the admin domain
  const adminDomain = config.public.adminDomain
  const isAdminDomain = host === adminDomain || host.startsWith('app.')

  if (isAdminDomain) {
    event.context.isAdmin = true
    event.context.projectId = null
    return
  }

  // For public domains, resolve the project
  try {
    const db = useDB()

    // Remove port from host if present
    const hostWithoutPort = host.split(':')[0]

    // Extract subdomain or use full domain for custom domains
    let subdomain: string | null = null
    let customDomain: string | null = null

    if (hostWithoutPort.includes('.')) {
      const parts = hostWithoutPort.split('.')
      if (parts.length >= 3 || hostWithoutPort.includes('localhost')) {
        // This is a subdomain like: project.yourapp.com or project.localhost
        subdomain = parts[0]
      } else {
        // This might be a custom domain like: customer-domain.com
        customDomain = hostWithoutPort
      }
    }

    // Query the database to find matching project
    console.log('Domain resolver:', { host, hostWithoutPort, subdomain, customDomain })

    const results = await db
      .select()
      .from(projects)
      .where(or(
        subdomain ? eq(projects.subdomain, subdomain) : undefined,
        customDomain ? eq(projects.customDomain, customDomain) : undefined
      ))
      .limit(1)
    const project = results[0]

    console.log('Found project:', project ? project.id : 'none')

    if (project) {
      event.context.isAdmin = false
      event.context.projectId = project.id
      event.context.project = project
    } else {
      // No matching project found
      event.context.isAdmin = false
      event.context.projectId = null
    }
  } catch (error) {
    console.error('Domain resolution error:', error)
    event.context.isAdmin = false
    event.context.projectId = null
  }
})
