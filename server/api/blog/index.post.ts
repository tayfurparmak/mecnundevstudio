export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yazı başlığı zorunludur.',
    })
  }

  const title = body.title.trim()
  if (title.length > 255) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yazı başlığı en fazla 255 karakter olabilir.',
    })
  }

  if (typeof body.content !== 'string' || !body.content.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yazı içeriği boş olamaz.',
    })
  }

  const content = body.content.trim()
  const customSlug = typeof body.slug === 'string' && body.slug.trim() ? body.slug.trim() : undefined
  const isPublished = typeof body.isPublished === 'boolean' ? body.isPublished : false

  try {
    const slug = await generateUniquePostSlug(title, customSlug)

    const post = await prisma.post.create({
      data: {
        title,
        slug,
        content,
        isPublished,
      },
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
      statusMessage: error?.message || 'Blog yazısı oluşturulurken bir hata oluştu.',
    })
  }
})
