import { z } from 'zod'
import { eq, and } from 'drizzle-orm'
import { websites, users } from '../../../database/schema'

const updateWebsiteThemesSchema = z.object({
  themeHeaderId: z.string().nullable().optional(),
  themeFooterId: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const websiteId = getRouterParam(event, 'id')
  if (!websiteId) {
    throw createError({
      statusCode: 400,
      message: 'Website ID is required',
    })
  }

  const body = await readBody(event)
  const validatedData = updateWebsiteThemesSchema.parse(body)

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

  // Check if website exists and user has access
  const existingWebsite = await db
    .select()
    .from(websites)
    .where(and(
      eq(websites.id, websiteId),
      eq(websites.accountId, accountId)
    ))
    .limit(1)

  if (existingWebsite.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    })
  }

  // Update website themes
  await db
    .update(websites)
    .set({
      ...validatedData,
      updatedAt: new Date(),
    })
    .where(eq(websites.id, websiteId))

  // Fetch updated website
  const updatedWebsite = await db
    .select()
    .from(websites)
    .where(eq(websites.id, websiteId))
    .limit(1)

  return {
    success: true,
    data: updatedWebsite[0],
  }
})
