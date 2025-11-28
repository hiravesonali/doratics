import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { pages, websites, users } from '../../../database/schema'

const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  layoutJson: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const websiteId = getRouterParam(event, 'projectId')
  const pageId = getRouterParam(event, 'pageId')
  const db = useDB()

  if (!websiteId || !pageId) {
    throw createError({
      statusCode: 400,
      message: 'Website ID and Page ID required',
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

  // Verify page belongs to website
  const pageResults = await db
    .select()
    .from(pages)
    .where(and(
      eq(pages.id, pageId),
      eq(pages.websiteId, websiteId)
    ))
    .limit(1)
  const page = pageResults[0]

  if (!page) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }

  const body = await readBody(event)
  const validatedData = updatePageSchema.parse(body)

  const updateData = {
    ...validatedData,
    updatedAt: new Date(),
  }

  await db
    .update(pages)
    .set(updateData)
    .where(eq(pages.id, pageId))

  return {
    success: true,
    message: 'Page updated successfully',
  }
})
