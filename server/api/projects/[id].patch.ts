import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { projects } from '../../database/schema'

const updateProjectSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  customDomain: z.string().nullable().optional(),
  themeHeaderId: z.string().nullable().optional(),
  themeFooterId: z.string().nullable().optional(),
  published: z.boolean().optional(),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const projectId = getRouterParam(event, 'id')
  const db = useDB()

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID required',
    })
  }

  const body = await readBody(event)
  const validatedData = updateProjectSchema.parse(body)

  // Verify ownership
  const project = await db.query.projects.findFirst({
    where: and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ),
  })

  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  const updateData = {
    ...validatedData,
    updatedAt: new Date(),
  }

  await db
    .update(projects)
    .set(updateData)
    .where(eq(projects.id, projectId))

  return {
    success: true,
    message: 'Project updated successfully',
  }
})
