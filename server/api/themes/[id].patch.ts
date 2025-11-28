import { nanoid } from 'nanoid'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { themes } from '../../database/schema'

const updateThemeSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  layoutJson: z.record(z.string(), z.unknown()).optional(),
})

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
