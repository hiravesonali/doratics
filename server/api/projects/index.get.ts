import { eq } from 'drizzle-orm'
import { projects } from '../../database/schema'

export default defineEventHandler(async (event) => {
  const userId = await requireAuth(event)
  const db = useDB()

  const userProjects = await db.query.projects.findMany({
    where: eq(projects.userId, userId),
    orderBy: (projects, { desc }) => [desc(projects.createdAt)],
  })

  return {
    success: true,
    data: userProjects,
  }
})
