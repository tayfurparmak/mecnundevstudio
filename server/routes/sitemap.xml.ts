import { prisma } from '~/server/utils/prisma'

export default defineEventHandler(async (event) => {
  const baseUrl = process.env.SITE_URL || 'https://mecnunum.dev'

  const staticRoutes = [
    { url: '/', changefreq: 'daily', priority: '1.0' },
    { url: '/about', changefreq: 'monthly', priority: '0.8' },
    { url: '/technologies', changefreq: 'weekly', priority: '0.9' },
    { url: '/blog', changefreq: 'daily', priority: '0.9' },
    { url: '/news', changefreq: 'weekly', priority: '0.8' },
    { url: '/contact', changefreq: 'monthly', priority: '0.7' },
  ]

  let posts: Array<{ slug: string; createdAt: Date }> = []
  try {
    posts = await prisma.post.findMany({
      where: { isPublished: true },
      select: {
        slug: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })
  } catch (error) {
    console.error('Error generating sitemap posts:', error)
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticRoutes
  .map(
    (route) => `  <url>
    <loc>${baseUrl}${route.url}</loc>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  )
  .join('\n')}
${posts
  .map(
    (post) => `  <url>
    <loc>${baseUrl}/blog/${post.slug}</loc>
    <lastmod>${new Date(post.createdAt).toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.85</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  setHeader(event, 'cache-control', 'public, max-age=3600, s-maxage=86400')

  return sitemapXml
})
