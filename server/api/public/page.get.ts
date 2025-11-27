import { eq, and } from 'drizzle-orm'
import { pages, themes } from '../../database/schema'
import { generateImpressum, generatePrivacyPolicy } from '../../utils/legal-templates'

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event)
  const projectId = event.context.projectId
  const project = event.context.project

  if (!projectId || !project) {
    throw createError({
      statusCode: 404,
      message: 'Project not found',
    })
  }

  const db = useDB()

  // Handle legal pages specially
  if (slug === 'impressum' || slug === 'privacy') {
    const legalProfile = await db.query.legalProfiles.findFirst({
      where: eq(pages.projectId, projectId),
    })

    if (!legalProfile) {
      throw createError({
        statusCode: 404,
        message: 'Legal information not configured',
      })
    }

    const content = slug === 'impressum'
      ? generateImpressum(legalProfile)
      : generatePrivacyPolicy(legalProfile)

    return {
      success: true,
      data: {
        slug,
        title: slug === 'impressum' ? 'Impressum' : 'Datenschutz',
        layoutJson: {
          type: 'legal-page',
          content,
        },
        seoTitle: slug === 'impressum' ? 'Impressum' : 'Datenschutzerklärung',
        seoDescription: '',
        status: 'published',
      },
    }
  }

  // Fetch regular page
  const normalizedSlug = slug === '/' || !slug ? '/' : String(slug)

  const page = await db.query.pages.findFirst({
    where: and(
      eq(pages.projectId, projectId),
      eq(pages.slug, normalizedSlug),
      eq(pages.status, 'published')
    ),
  })

  if (!page) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }

  // Fetch theme header and footer
  let headerTheme = null
  let footerTheme = null

  if (project.themeHeaderId) {
    headerTheme = await db.query.themes.findFirst({
      where: eq(themes.id, project.themeHeaderId),
    })
  }

  if (project.themeFooterId) {
    footerTheme = await db.query.themes.findFirst({
      where: eq(themes.id, project.themeFooterId),
    })
  }

  return {
    success: true,
    data: page,
    headerTheme,
    footerTheme,
  }
})
