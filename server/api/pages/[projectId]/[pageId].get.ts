import { eq, and } from 'drizzle-orm'
import { pages, projects } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const projectId = getRouterParam(event, 'projectId')
  const pageId = getRouterParam(event, 'pageId')
  const db = useDB()

  if (!projectId || !pageId) {
    throw createError({
      statusCode: 400,
      message: 'Project ID and Page ID required',
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

  if (projectResults.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  // Fetch the page
  const pageResults = await db
    .select()
    .from(pages)
    .where(and(
      eq(pages.id, pageId),
      eq(pages.projectId, projectId)
    ))
    .limit(1)

  if (pageResults.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }

  return {
    success: true,
    data: pageResults[0],
  }
})
