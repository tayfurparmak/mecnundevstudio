export default defineEventHandler(async (event) => {
  const params = getRouterParams(event)
  const slugOrId = getRouterParam(event, 'slug') || event.context.params?.slug || (params ? Object.values(params)[0] : null)

  if (!slugOrId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yazı parametresi (slug veya ID) belirtilmelidir.',
    })
  }

  const isAdmin = verifyAdminSession(event)
  const isNumeric = /^\d+$/.test(slugOrId)
  const numericId = isNumeric ? Number.parseInt(slugOrId, 10) : null

  try {
    const post = await prisma.post.findFirst({
      where: isNumeric && numericId
        ? {
            OR: [
              { id: numericId },
              { slug: slugOrId },
            ],
          }
        : {
            slug: slugOrId,
          },
    })

    if (!post) {
      throw createError({
        statusCode: 404,
        statusMessage: 'İstenen blog yazısı bulunamadı.',
      })
    }

    // If post is a draft and requester is NOT admin, return 404
    if (!post.isPublished && !isAdmin) {
      throw createError({
        statusCode: 404,
        statusMessage: 'İstenen blog yazısı bulunamadı veya henüz yayınlanmadı.',
      })
    }

    return {
      success: true,
      post,
    }
  } catch (error: any) {
    if (error?.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Blog yazısı getirilirken bir hata oluştu.',
    })
  }
})
