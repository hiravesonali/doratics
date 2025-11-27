import { eq, and, asc } from 'drizzle-orm'
import { pages, projects } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const projectId = getRouterParam(event, 'projectId')
  const db = useDB()

  if (!projectId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID required',
    })
  }

  // Verify project ownership
  const projectResults = await db
    .select()
    .from(projects)
    .where(and(
      eq(projects.id, projectId),
      eq(projects.userId, userId)
    ))
    .limit(1)
  const project = projectResults[0]

  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  const projectPages = await db
    .select()
    .from(pages)
    .where(eq(pages.projectId, projectId))
    .orderBy(asc(pages.slug))

  return {
    success: true,
    data: projectPages,
  }
})
