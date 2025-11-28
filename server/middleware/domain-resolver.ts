import { eq, or } from 'drizzle-orm'
import { websites } from '../database/schema'

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
    event.context.websiteId = null
    return
  }

  // For public domains, resolve the website
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
        // This is a subdomain like: website.yourapp.com or website.localhost
        subdomain = parts[0]
      } else {
        // This might be a custom domain like: customer-domain.com
        customDomain = hostWithoutPort
      }
    }

    // Query the database to find matching website
    console.log('Domain resolver:', { host, hostWithoutPort, subdomain, customDomain })

    const results = await db
      .select()
      .from(websites)
      .where(or(
        subdomain ? eq(websites.subdomain, subdomain) : undefined,
        customDomain ? eq(websites.customDomain, customDomain) : undefined
      ))
      .limit(1)
    const website = results[0]

    console.log('Found website:', website ? website.id : 'none')

    if (website) {
      event.context.isAdmin = false
      event.context.websiteId = website.id
      event.context.website = website
    } else {
      // No matching website found
      event.context.isAdmin = false
      event.context.websiteId = null
    }
  } catch (error) {
    console.error('Domain resolution error:', error)
    event.context.isAdmin = false
    event.context.websiteId = null
  }
})
