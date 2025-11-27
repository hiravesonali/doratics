import { eq, and } from 'drizzle-orm'
import { z } from 'zod'
import { pages, projects } from '../../../database/schema'

const updatePageSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  layoutJson: z.record(z.any()).optional(),
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

  // Verify page belongs to project
  const page = await db.query.pages.findFirst({
    where: and(
      eq(pages.id, pageId),
      eq(pages.projectId, projectId)
    ),
  })

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
