import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { projects } from '../../../database/schema'

const updateProjectThemesSchema = z.object({
  themeHeaderId: z.string().nullable().optional(),
  themeFooterId: z.string().nullable().optional(),
})

export default defineEventHandler(async (event) => {
  await requireAuth(event)
  const db = useDB()

  const projectId = getRouterParam(event, 'id')
  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID is required',
    })
  }

  const body = await readBody(event)
  const validatedData = updateProjectThemesSchema.parse(body)

  // Check if project exists
  const existingProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1)

  if (existingProject.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  // Update project themes
  await db
    .update(projects)
    .set({
      ...validatedData,
      updatedAt: new Date(),
    })
    .where(eq(projects.id, projectId))

  // Fetch updated project
  const updatedProject = await db
    .select()
    .from(projects)
    .where(eq(projects.id, projectId))
    .limit(1)

  return {
    success: true,
    data: updatedProject[0],
  }
})
