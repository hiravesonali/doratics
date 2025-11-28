import { eq, and } from 'drizzle-orm'
import { pages, themes, legalProfiles, websites } from '../../database/schema'
import { generateImpressum, generatePrivacyPolicy } from '../../utils/legal-templates'

export default defineEventHandler(async (event) => {
  const { slug } = getQuery(event)
  const websiteId = event.context.websiteId
  const website = event.context.website

  if (!websiteId || !website) {
    throw createError({
      statusCode: 404,
      message: 'Website not found',
    })
  }

  const db = useDB()

  // Handle legal pages specially
  if (slug === 'impressum' || slug === 'privacy') {
    // Legal profiles are now account-based, need to get accountId from website
    const websiteResults = await db
      .select()
      .from(websites)
      .where(eq(websites.id, websiteId))
      .limit(1)
    const websiteData = websiteResults[0]

    if (!websiteData) {
      throw createError({
        statusCode: 404,
        message: 'Website not found',
      })
    }

    const legalProfileResults = await db
      .select()
      .from(legalProfiles)
      .where(eq(legalProfiles.accountId, websiteData.accountId))
      .limit(1)
    const legalProfile = legalProfileResults[0]

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

  const pageResults = await db
    .select()
    .from(pages)
    .where(and(
      eq(pages.websiteId, websiteId),
      eq(pages.slug, normalizedSlug),
      eq(pages.status, 'published')
    ))
    .limit(1)
  const page = pageResults[0]

  if (!page) {
    throw createError({
      statusCode: 404,
      message: 'Page not found',
    })
  }

  // Fetch theme header and footer
  let headerTheme = null
  let footerTheme = null

  if (website.themeHeaderId) {
    const headerResults = await db
      .select()
      .from(themes)
      .where(eq(themes.id, website.themeHeaderId))
      .limit(1)
    headerTheme = headerResults[0]
  }

  if (website.themeFooterId) {
    const footerResults = await db
      .select()
      .from(themes)
      .where(eq(themes.id, website.themeFooterId))
      .limit(1)
    footerTheme = footerResults[0]
  }

  return {
    success: true,
    data: page,
    headerTheme,
    footerTheme,
  }
})
