import { eq, and } from 'drizzle-orm'
import { pages, websites, users } from '../../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const websiteId = getRouterParam(event, 'projectId')
  const pageId = getRouterParam(event, 'pageId')
  const db = useDB()

  if (!websiteId || !pageId) {
    throw createError({
      statusCode: 400,
      message: 'Website ID and Page ID required',
    })
  }

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

  // Verify website ownership
  const websiteResults = await db
    .select()
    .from(websites)
    .where(and(
      eq(websites.id, websiteId),
      eq(websites.accountId, accountId)
    ))
    .limit(1)

  if (websiteResults.length === 0) {
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    })
  }

  // Fetch the page
  const pageResults = await db
    .select()
    .from(pages)
    .where(and(
      eq(pages.id, pageId),
      eq(pages.websiteId, websiteId)
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
