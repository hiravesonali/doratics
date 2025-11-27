import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { pages, projects } from '../../../database/schema'

const createPageSchema = z.object({
  slug: z.string().min(1).max(100).regex(/^[a-z0-9-\/]+$/),
  title: z.string().min(1).max(200),
  layoutJson: z.record(z.any()),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft'),
})

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

  const body = await readBody(event)
  const validatedData = createPageSchema.parse(body)

  // Check if slug already exists for this project
  const existingPage = await db.query.pages.findFirst({
    where: and(
      eq(pages.projectId, projectId),
      eq(pages.slug, validatedData.slug)
    ),
  })

  if (existingPage) {
    throw createError({
      statusCode: 400,
      message: 'Page with this slug already exists',
    })
  }

  const newPage = {
    id: nanoid(),
    projectId,
    slug: validatedData.slug,
    title: validatedData.title,
    layoutJson: validatedData.layoutJson,
    seoTitle: validatedData.seoTitle || validatedData.title,
    seoDescription: validatedData.seoDescription || '',
    status: validatedData.status,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(pages).values(newPage)

  return {
    success: true,
    data: newPage,
  }
})
