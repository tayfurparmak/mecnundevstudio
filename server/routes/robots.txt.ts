export default defineEventHandler((event) => {
  const baseUrl = process.env.SITE_URL || 'https://mecnunum.dev'
  
  const robotsTxt = `User-agent: *
Disallow: /admin
Disallow: /api
Allow: /

Sitemap: ${baseUrl}/sitemap.xml
`

  setHeader(event, 'content-type', 'text/plain')
  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=86400')
  return robotsTxt
})
