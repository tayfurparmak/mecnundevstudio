export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz kelime ID.',
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
    word?: string
    meaning?: string
    example?: string | null
    phonetic?: string | null
    level?: string
    topic?: string | null
  } = {}

  if (typeof body.word === 'string' && body.word.trim()) updateData.word = body.word.trim().toLowerCase()
  if (typeof body.meaning === 'string' && body.meaning.trim()) updateData.meaning = body.meaning.trim()
  if (typeof body.example === 'string') updateData.example = body.example.trim()
  if (typeof body.phonetic === 'string') updateData.phonetic = body.phonetic.trim()
  if (typeof body.level === 'string') updateData.level = body.level.toUpperCase()
  if (typeof body.topic === 'string') updateData.topic = body.topic.trim()

  try {
    const word = await prisma.vocabularyWord.update({
      where: { id },
      data: updateData,
    })

    return {
      success: true,
      word,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Kelime güncellenirken bir hata oluştu.',
    })
  }
})
