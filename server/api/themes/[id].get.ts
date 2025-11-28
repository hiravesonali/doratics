import { eq } from 'drizzle-orm'
import { themes } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Theme ID is required',
    })
  }

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

  return {
    success: true,
    data: theme[0],
  }
})
