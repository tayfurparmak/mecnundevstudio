export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Not başlığı zorunludur.',
    })
  }

  if (typeof body.content !== 'string' || !body.content.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Not içeriği boş olamaz.',
    })
  }

  const title = body.title.trim()
  const content = body.content.trim()
  const technology = typeof body.technology === 'string' && body.technology.trim() ? body.technology.trim() : 'Genel'
  const topic = typeof body.topic === 'string' ? body.topic.trim() : null
  const imageUrl = typeof body.imageUrl === 'string' ? body.imageUrl.trim() : null
  const status = body.status === 'PUBLIC' ? 'PUBLIC' : 'PRIVATE'

  try {
    const note = await prisma.learningNote.create({
      data: {
        title,
        content,
        technology,
        topic,
        imageUrl,
        status,
      },
    })

    return {
      success: true,
      note,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Öğrenme notu kaydedilirken bir hata oluştu.',
    })
  }
})
