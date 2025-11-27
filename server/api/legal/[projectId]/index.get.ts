import { eq, and } from 'drizzle-orm'
import { legalProfiles, projects } from '../../../database/schema'

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

  const legalProfile = await db.query.legalProfiles.findFirst({
    where: eq(legalProfiles.projectId, projectId),
  })

  return {
    success: true,
    data: legalProfile || null,
  }
})
