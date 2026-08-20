export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz yazı kimliği (ID).',
    })
  }

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Güncellenecek veri bulunamadı.',
    })
  }

  const existingPost = await prisma.post.findUnique({
    where: { id },
  })

  if (!existingPost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Güncellenmek istenen blog yazısı bulunamadı.',
    })
  }

  const updateData: {
    title?: string
    content?: string
    slug?: string
    isPublished?: boolean
  } = {}

  if (typeof body.title === 'string') {
    const trimmed = body.title.trim()
    if (!trimmed) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Yazı başlığı boş bırakılamaz.',
      })
    }
    if (trimmed.length > 255) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Yazı başlığı en fazla 255 karakter olabilir.',
      })
    }
    updateData.title = trimmed
  }

  if (typeof body.content === 'string') {
    const trimmed = body.content.trim()
    if (!trimmed) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Yazı içeriği boş bırakılamaz.',
      })
    }
    updateData.content = trimmed
  }

  if (typeof body.slug === 'string' && body.slug.trim()) {
    const uniqueSlug = await generateUniquePostSlug(
      updateData.title || existingPost.title,
      body.slug.trim(),
      id
    )
    updateData.slug = uniqueSlug
  }

  if (typeof body.isPublished === 'boolean') {
    updateData.isPublished = body.isPublished
  }

  try {
    const post = await prisma.post.update({
      where: { id },
      data: updateData,
    })

    return {
      success: true,
      post,
    }
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Bu slug ile başka bir yazı zaten mevcut.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Blog yazısı güncellenirken bir hata oluştu.',
    })
  }
})
