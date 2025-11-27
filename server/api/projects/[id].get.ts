import { eq, and } from 'drizzle-orm'
import { projects } from '../../database/schema'

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

  const result = await db
    .select()
    .from(projects)
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ))
    .limit(1)

  if (result.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  return {
    success: true,
    data: result[0],
  }
})
