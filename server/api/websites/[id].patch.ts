import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { websites, users } from '../../database/schema'

const updateWebsiteSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  customDomain: z.string().nullable().optional(),
  themeHeaderId: z.string().nullable().optional(),
  themeFooterId: z.string().nullable().optional(),
  published: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const websiteId = getRouterParam(event, 'id')
  const db = useDB()

  if (!websiteId) {
    throw createError({
      statusCode: 400,
      message: 'Website ID required',
    })
  }

  const body = await readBody(event)
  const validatedData = updateWebsiteSchema.parse(body)

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

  // Verify ownership
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

  const updateData = {
    ...validatedData,
    updatedAt: new Date(),
  }

  await db
    .update(websites)
    .set(updateData)
    .where(eq(websites.id, websiteId))

  return {
    success: true,
    message: 'Website updated successfully',
  }
})
