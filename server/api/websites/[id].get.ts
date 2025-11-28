import { eq, and } from 'drizzle-orm'
import { websites, users } from '../../database/schema'

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

  const result = await db
    .select()
    .from(websites)
    .where(and(
      eq(websites.id, websiteId),
      eq(websites.accountId, accountId)
    ))
    .limit(1)

  if (result.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    })
  }

  return {
    success: true,
    data: result[0],
  }
})
