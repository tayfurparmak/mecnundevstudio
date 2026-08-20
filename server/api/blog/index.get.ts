export default defineEventHandler(async (event) => {
  const isAdmin = verifyAdminSession(event)
  const query = getQuery(event)
  const statusFilter = typeof query.status === 'string' ? query.status.toLowerCase() : null

  try {
    let whereClause: { isPublished?: boolean } = {}

    if (isAdmin) {
      if (statusFilter === 'published') {
        whereClause = { isPublished: true }
      } else if (statusFilter === 'draft') {
        whereClause = { isPublished: false }
      }
      // If no filter or 'all', admin gets both published and drafts
    } else {
      // Public visitors MUST ONLY see published posts
      whereClause = { isPublished: true }
    }

    const posts = await prisma.post.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      posts,
      isAdmin,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Blog yazıları getirilirken bir hata oluştu.',
    })
  }
})
