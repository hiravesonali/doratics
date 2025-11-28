import { eq, desc } from 'drizzle-orm'
import { websites, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  // Get user's account
  const user = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (user.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  const accountId = user[0].accountId

  // Get all websites for this account
  const accountWebsites = await db
    .select()
    .from(websites)
    .where(eq(websites.accountId, accountId))
    .orderBy(desc(websites.createdAt))

  return {
    success: true,
    data: accountWebsites,
  }
})
