import { nanoid } from 'nanoid'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { websites, users, pages, themes } from '../../database/schema'

// Reserved subdomains that cannot be used by users
const RESERVED_SUBDOMAINS = [
  // Technical/Infrastructure
  'api',
  'app',
  'admin',
  'dashboard',
  'console',
  'portal',
  'staging',
  'dev',
  'test',
  'demo',
  'www',
  'assets',
  'static',
  'cdn',
  'media',
  'images',
  'files',
  'uploads',
  'download',
  'downloads',

  // Email & Communication
  'mail',
  'email',
  'smtp',
  'imap',
  'pop',
  'webmail',
  'newsletter',

  // Authentication & Security
  'auth',
  'login',
  'logout',
  'signin',
  'signup',
  'register',
  'password',
  'reset',
  'verify',
  'account',
  'accounts',
  'security',

  // Business & Marketing
  'blog',
  'news',
  'help',
  'support',
  'docs',
  'documentation',
  'wiki',
  'forum',
  'community',
  'status',
  'about',
  'contact',
  'pricing',
  'plans',
  'enterprise',
  'business',
  'pro',
  'premium',
  'shop',
  'store',
  'marketplace',
  'career',
  'careers',
  'jobs',
  'legal',
  'terms',
  'privacy',
  'cookies',

  // Social & Marketing
  'social',
  'facebook',
  'twitter',
  'instagram',
  'linkedin',
  'youtube',
  'marketing',
  'campaign',
  'analytics',

  // Common Names (to prevent squatting)
  'home',
  'main',
  'root',
  'public',
  'private',
  'internal',
  'external',
  'client',
  'customer',
  'user',
  'users',
  'member',
  'members',
  'partner',
  'partners',
  'vendor',
  'vendors',
  'affiliate',
  'affiliates',

  // Technical Terms
  'localhost',
  'server',
  'database',
  'db',
  'cache',
  'queue',
  'worker',
  'cron',
  'backup',
  'log',
  'logs',
  'monitoring',
  'metrics',
  'health',
]

const createWebsiteSchema = z.object({
  name: z.string().min(1).max(100),
  industryType: z.enum(['electrician', 'plumber', 'cleaner', 'painter', 'gardener', 'other']),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const body = await readBody(event)
  const validatedData = createWebsiteSchema.parse(body)

  // Check if subdomain is reserved
  if (RESERVED_SUBDOMAINS.includes(validatedData.subdomain.toLowerCase())) {
    throw createError({
      statusCode: 400,
      message: 'This subdomain is reserved and cannot be used. Please choose a different subdomain.',
    })
  }

  // Check if subdomain is already taken
  const existing = await db
    .select()
    .from(websites)
    .where(eq(websites.subdomain, validatedData.subdomain))
    .limit(1)

  if (existing.length > 0) {
    throw createError({
      statusCode: 400,
      message: 'Subdomain already taken',
    })
  }

  // Get user's accountId from users table
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (userResult.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  const accountId = userResult[0].accountId

  // Get default themes (simple header and simple footer)
  const defaultThemes = await db
    .select()
    .from(themes)
    .where(eq(themes.name, 'Simple Header'))
    .limit(1)

  const defaultFooterThemes = await db
    .select()
    .from(themes)
    .where(eq(themes.name, 'Simple Footer'))
    .limit(1)

  const newWebsite = {
    id: nanoid(),
    accountId,
    name: validatedData.name,
    industryType: validatedData.industryType,
    subdomain: validatedData.subdomain,
    customDomain: null,
    themeHeaderId: defaultThemes[0]?.id || null,
    themeFooterId: defaultFooterThemes[0]?.id || null,
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(websites).values(newWebsite)

  // Automatically create a homepage for the new website
  const homePage = {
    id: nanoid(),
    websiteId: newWebsite.id,
    slug: '/',
    title: 'Home',
    layoutJson: { html: "" }, // Empty HTML for PageBuilder
    seoTitle: validatedData.name,
    seoDescription: `Welcome to ${validatedData.name}`,
    status: 'published' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(pages).values(homePage)

  return {
    success: true,
    data: newWebsite,
  }
})
