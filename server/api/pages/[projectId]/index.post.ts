import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { pages, websites, users } from '../../../database/schema'

const createPageSchema = z.object({
  slug: z.string()
    .min(1, "Slug is required")
    .max(100, "Slug must be less than 100 characters")
    .transform((val) => {
      // Convert to lowercase and replace invalid characters with hyphens
      return val.toLowerCase().replace(/[^a-z0-9\/]/g, '-').replace(/--+/g, '-').replace(/^-|-$/g, '');
    }),
  title: z.string().min(1).max(200),
  layoutJson: z.record(z.string(), z.unknown()).optional().default({}),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).optional().default('draft'),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const websiteId = getRouterParam(event, 'projectId')
  const db = useDB()

  if (!websiteId) {
    throw createError({
      statusCode: 400,
      message: 'Website ID required',
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

  // Verify website ownership
  const websiteResults = await db
    .select()
    .from(websites)
    .where(and(
      eq(websites.id, websiteId),
      eq(websites.accountId, accountId)
    ))
    .limit(1)
  const website = websiteResults[0]

  if (!website) {
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    })
  }

  const body = await readBody(event)
  const validatedData = createPageSchema.parse(body)

  // Check if slug already exists for this website
  const existingPageResults = await db
    .select()
    .from(pages)
    .where(and(
      eq(pages.websiteId, websiteId),
      eq(pages.slug, validatedData.slug)
    ))
    .limit(1)
  const existingPage = existingPageResults[0]

  if (existingPage) {
    throw createError({
      statusCode: 400,
      message: 'Page with this slug already exists',
    })
  }

  // Set default layoutJson with proper structure for PageBuilder
  const defaultLayoutJson = {
    html: '' // Empty HTML for fresh page
  }

  const newPage = {
    id: nanoid(),
    websiteId,
    slug: validatedData.slug,
    title: validatedData.title,
    layoutJson: validatedData.layoutJson && Object.keys(validatedData.layoutJson).length > 0
      ? validatedData.layoutJson
      : defaultLayoutJson,
    seoTitle: validatedData.seoTitle || validatedData.title,
    seoDescription: validatedData.seoDescription || '',
    status: validatedData.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(pages).values(newPage)

  return {
    success: true,
    data: newPage,
  }
})
