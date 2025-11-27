import { nanoid } from 'nanoid'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { projects, pages } from '../../database/schema'

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

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  industryType: z.enum(['electrician', 'plumber', 'cleaner', 'painter', 'gardener', 'other']),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const body = await readBody(event)
  const validatedData = createProjectSchema.parse(body)

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
    .from(projects)
    .where(eq(projects.subdomain, validatedData.subdomain))
    .limit(1)

  if (existing.length > 0) {
    throw createError({
      statusCode: 400,
      message: 'Subdomain already taken',
    })
  }

  const newProject = {
    id: nanoid(),
    userId,
    name: validatedData.name,
    industryType: validatedData.industryType,
    subdomain: validatedData.subdomain,
    customDomain: null,
    themeHeaderId: null,
    themeFooterId: null,
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(projects).values(newProject)

  // Automatically create a homepage for the new project
  const homePage = {
    id: nanoid(),
    projectId: newProject.id,
    slug: '/',
    title: 'Home',
    layoutJson: { html: `Welcome to ${validatedData.name}` }, // Empty HTML for PageBuilder
    seoTitle: validatedData.name,
    seoDescription: `Welcome to ${validatedData.name}`,
    status: 'published' as const,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(pages).values(homePage)

  return {
    success: true,
    data: newProject,
  }
})
