import { eq } from 'drizzle-orm'
import { pages } from '../database/schema'

export default defineEventHandler(async (event) => {
  const projectId = event.context.projectId
  const project = event.context.project

  if (!projectId || !project) {
    return send(event, '<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"></urlset>', 'application/xml')
  }

  const db = useDB()

  // Get all published pages for this project
  const publishedPages = await db.query.pages.findMany({
    where: eq(pages.projectId, projectId),
    columns: {
      slug: true,
      updatedAt: true,
    },
  })

  // Build sitemap XML
  const baseUrl = project.customDomain
    ? `https://${project.customDomain}`
    : `https://${project.subdomain}.${useRuntimeConfig().public.appDomain}`

  const urls = publishedPages.map((page) => {
    const url = page.slug === '/' ? baseUrl : `${baseUrl}/${page.slug}`
    const lastmod = new Date(page.updatedAt).toISOString().split('T')[0]

    return `
    <url>
      <loc>${url}</loc>
      <lastmod>${lastmod}</lastmod>
      <changefreq>weekly</changefreq>
      <priority>${page.slug === '/' ? '1.0' : '0.8'}</priority>
    </url>`
  }).join('')

  // Add legal pages
  const legalUrls = `
    <url>
      <loc>${baseUrl}/impressum</loc>
      <changefreq>monthly</changefreq>
      <priority>0.3</priority>
    </url>
    <url>
      <loc>${baseUrl}/privacy</loc>
      <changefreq>monthly</changefreq>
      <priority>0.3</priority>
    </url>`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${legalUrls}
</urlset>`

  setResponseHeader(event, 'Content-Type', 'application/xml')
  return sitemap
})
