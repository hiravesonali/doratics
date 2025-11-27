import { nanoid } from 'nanoid'
import { z } from 'zod'
import { eq } from 'drizzle-orm'
import { projects } from '../../database/schema'

const createProjectSchema = z.object({
  name: z.string().min(1).max(100),
  industryType: z.enum(['electrician', 'plumber', 'cleaner', 'painter', 'gardener', 'other']),
  subdomain: z.string().min(3).max(50).regex(/^[a-z0-9-]+$/),
})

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const body = await readBody(event)
  const validatedData = createProjectSchema.parse(body)

  // Check if subdomain is already taken
  const existing = await db.query.projects.findFirst({
    where: eq(projects.subdomain, validatedData.subdomain),
  })

  if (existing) {
    throw createError({
      statusCode: 400,
      message: 'Subdomain already taken',
    })
  }

  const newProject = {
    id: nanoid(),
    userId,
    name: validatedData.name,
    industryType: validatedData.industryType,
    subdomain: validatedData.subdomain,
    customDomain: null,
    themeHeaderId: null,
    themeFooterId: null,
    published: false,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.insert(projects).values(newProject)

  return {
    success: true,
    data: newProject,
  }
})
