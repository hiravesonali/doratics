import { nanoid } from 'nanoid'
import { eq } from 'drizzle-orm'
import { themes } from '../../../database/schema'

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

  // Get the original theme
  const originalTheme = await db
    .select()
    .from(themes)
    .where(eq(themes.id, id))
    .limit(1)

  if (originalTheme.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Theme not found',
    })
  }

  const theme = originalTheme[0]

  // Create a cloned theme with a new ID
  const clonedThemeId = nanoid()
  const clonedTheme = {
    id: clonedThemeId,
    name: `${theme.name} (Custom)`,
    type: theme.type,
    layoutJson: theme.layoutJson,
    previewImageUrl: theme.previewImageUrl,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(themes).values(clonedTheme)

  // Fetch the created theme
  const createdTheme = await db
    .select()
    .from(themes)
    .where(eq(themes.id, clonedThemeId))
    .limit(1)

  return {
    success: true,
    data: createdTheme[0],
  }
})
