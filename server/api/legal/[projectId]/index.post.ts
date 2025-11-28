import { eq } from 'drizzle-orm'
import { nanoid } from 'nanoid'
import { z } from 'zod'
import { legalProfiles, users } from '../../../database/schema'

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
  const db = useDB()

  // Get user's accountId from users table
  const userResult = await db
    .select()
    .from(users)
    .where(eq(users.id, userId))
    .limit(1)

  if (userResult.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'User not found',
    })
  }

  const accountId = userResult[0].accountId

  const body = await readBody(event)
  const validatedData = legalProfileSchema.parse(body)

  // Check if profile already exists for this account
  const existingResults = await db
    .select()
    .from(legalProfiles)
    .where(eq(legalProfiles.accountId, accountId))
    .limit(1)
  const existing = existingResults[0]

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
      accountId,
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
