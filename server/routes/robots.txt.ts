export default defineEventHandler((event) => {
  const project = event.context.project

  let sitemapUrl = `https://${useRuntimeConfig().public.appDomain}/sitemap.xml`

  if (project) {
    sitemapUrl = project.customDomain
      ? `https://${project.customDomain}/sitemap.xml`
      : `https://${project.subdomain}.${useRuntimeConfig().public.appDomain}/sitemap.xml`
  }

  const robotsTxt = `User-agent: *
Allow: /

Sitemap: ${sitemapUrl}`

  setResponseHeader(event, 'Content-Type', 'text/plain')
  return robotsTxt
})
