import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { pages, projects } from '../../../database/schema'

const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  layoutJson: z.record(z.string(), z.unknown()).optional(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).optional(),
})

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
  const project = projectResults[0]

  if (!project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  // Verify page belongs to project
  const pageResults = await db
    .select()
    .from(pages)
    .where(and(
      eq(pages.id, pageId),
      eq(pages.projectId, projectId)
    ))
    .limit(1)
  const page = pageResults[0]

  if (!page) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }

  const body = await readBody(event)
  const validatedData = updatePageSchema.parse(body)

  const updateData = {
    ...validatedData,
    updatedAt: new Date(),
  }

  await db
    .update(pages)
    .set(updateData)
    .where(eq(pages.id, pageId))

  return {
    success: true,
    message: 'Page updated successfully',
  }
})
