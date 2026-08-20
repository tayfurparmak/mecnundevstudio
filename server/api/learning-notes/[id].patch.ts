export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz not ID.',
    })
  }

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Güncellenecek veri bulunamadı.',
    })
  }

  const updateData: {
    title?: string
    content?: string
    technology?: string
    topic?: string | null
    imageUrl?: string | null
    status?: string
  } = {}

  if (typeof body.title === 'string' && body.title.trim()) updateData.title = body.title.trim()
  if (typeof body.content === 'string' && body.content.trim()) updateData.content = body.content.trim()
  if (typeof body.technology === 'string' && body.technology.trim()) updateData.technology = body.technology.trim()
  if (typeof body.topic === 'string') updateData.topic = body.topic.trim()
  if (typeof body.imageUrl === 'string') updateData.imageUrl = body.imageUrl.trim()
  if (body.status === 'PUBLIC' || body.status === 'PRIVATE') updateData.status = body.status

  try {
    const note = await prisma.learningNote.update({
      where: { id },
      data: updateData,
    })

    return {
      success: true,
      note,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Öğrenme notu güncellenirken bir hata oluştu.',
    })
  }
})
