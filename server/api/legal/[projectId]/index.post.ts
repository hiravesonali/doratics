import { eq, and } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { legalProfiles, projects } from '../../../database/schema'

const legalProfileSchema = z.object({
  companyName: z.string().min(1),
  ownerName: z.string().min(1),
  address: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(1),
  vatId: z.string().optional(),
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
  const validatedData = legalProfileSchema.parse(body)

  // Check if profile already exists
  const existing = await db.query.legalProfiles.findFirst({
    where: eq(legalProfiles.projectId, projectId),
  })

  if (existing) {
    // Update existing profile
    await db
      .update(legalProfiles)
      .set({
        ...validatedData,
        updatedAt: new Date(),
      })
      .where(eq(legalProfiles.id, existing.id))

    return {
      success: true,
      message: 'Legal profile updated',
    }
  } else {
    // Create new profile
    const newProfile = {
      id: nanoid(),
      projectId,
      ...validatedData,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    await db.insert(legalProfiles).values(newProfile)

    return {
      success: true,
      data: newProfile,
    }
  }
})
