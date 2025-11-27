import { eq, desc } from 'drizzle-orm'
import { projects } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const userProjects = await db
    .select()
    .from(projects)
    .where(eq(projects.userId, userId))
    .orderBy(desc(projects.createdAt))

  return {
    success: true,
    data: userProjects,
  }
})
