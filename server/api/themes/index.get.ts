import { eq, or, isNull } from 'drizzle-orm'
import { themes, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const query = getQuery(event)
  const type = query.type as string | undefined // 'header' | 'footer'

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

  // Build query to get both global themes (accountId = null) and user's custom themes
  let themesQuery = db
    .select()
    .from(themes)
    .where(
      or(
        isNull(themes.accountId), // Global themes
        eq(themes.accountId, accountId) // User's custom themes
      )
    )

  // Filter by type if provided
  if (type && (type === 'header' || type === 'footer')) {
    themesQuery = themesQuery.where(eq(themes.type, type)) as any
  }

  const allThemes = await themesQuery

  return {
    success: true,
    data: allThemes,
  }
})
