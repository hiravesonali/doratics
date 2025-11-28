import { eq } from 'drizzle-orm'
import { themes } from '../../database/schema'

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()

  const query = getQuery(event)
  const type = query.type as string | undefined // 'header' | 'footer'

  let themesQuery = db.select().from(themes)

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
