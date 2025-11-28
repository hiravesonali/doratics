import { nanoid } from 'nanoid'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { themes, users } from '../../database/schema'

const updateThemeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  layoutJson: z.record(z.string(), z.unknown()).optional(),
})

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

  const body = await readBody(event)
  const validatedData = updateThemeSchema.parse(body)

  // Check if theme exists
  const existingTheme = await db
    .select()
    .from(themes)
    .where(eq(themes.id, id))
    .limit(1)

  if (existingTheme.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Theme not found',
    })
  }

  const theme = existingTheme[0]

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

  // Verify that the theme belongs to the user (not a global theme)
  if (theme.accountId === null) {
    throw createError({
      statusCode: 403,
      message: 'Cannot update global themes. Clone the theme first to create a custom version.',
    })
  }

  if (theme.accountId !== accountId) {
    throw createError({
      statusCode: 403,
      message: 'You do not have permission to update this theme',
    })
  }

  // Update theme
  await db
    .update(themes)
    .set({
      ...validatedData,
      updatedAt: new Date(),
    })
    .where(eq(themes.id, id))

  // Fetch updated theme
  const updatedTheme = await db
    .select()
    .from(themes)
    .where(eq(themes.id, id))
    .limit(1)

  return {
    success: true,
    data: updatedTheme[0],
  }
})
