import { eq, or, isNull } from 'drizzle-orm'
import { themes, users } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Theme ID is required',
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

  // Fetch the theme
  const theme = await db
    .select()
    .from(themes)
    .where(eq(themes.id, id))
    .limit(1)

  if (theme.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Theme not found',
    })
  }

  const foundTheme = theme[0]

  // Verify user has access to this theme (either global or their own custom theme)
  if (foundTheme.accountId !== null && foundTheme.accountId !== accountId) {
    throw createError({
      statusCode: 403,
      message: 'You do not have permission to access this theme',
    })
  }

  return {
    success: true,
    data: foundTheme,
  }
})
