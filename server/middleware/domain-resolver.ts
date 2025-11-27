import { eq, or } from 'drizzle-orm'
import { projects } from '../database/schema'

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  const host = getRequestHeader(event, 'host') || ''
  const path = event.path || '/'

  // Skip for static assets and API routes
  if (
    path.startsWith('/_nuxt') ||
    path.startsWith('/api') ||
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

    // Extract subdomain or use full domain for custom domains
    let subdomain: string | null = null
    let customDomain: string | null = null

    if (host.includes('.')) {
      const parts = host.split('.')
      if (parts.length >= 3) {
        // This might be a subdomain like: project.yourapp.com
        subdomain = parts[0]
      } else {
        // This might be a custom domain like: customer-domain.com
        customDomain = host
      }
    }

    // Query the database to find matching project
    const project = await db.query.projects.findFirst({
      where: or(
        subdomain ? eq(projects.subdomain, subdomain) : undefined,
        customDomain ? eq(projects.customDomain, customDomain) : undefined
      ),
    })

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
