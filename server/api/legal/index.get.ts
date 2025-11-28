import { eq } from 'drizzle-orm'
import { legalProfiles, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

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

  const legalProfileResults = await db
    .select()
    .from(legalProfiles)
    .where(eq(legalProfiles.accountId, accountId))
    .limit(1)
  const legalProfile = legalProfileResults[0]

  return {
    success: true,
    data: legalProfile || null,
  }
})
