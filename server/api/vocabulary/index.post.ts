export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.word !== 'string' || !body.word.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kelime (word) zorunludur.',
    })
  }

  if (typeof body.meaning !== 'string' || !body.meaning.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Kelime anlamı (meaning) zorunludur.',
    })
  }

  const word = body.word.trim().toLowerCase()
  const meaning = body.meaning.trim()
  const example = typeof body.example === 'string' ? body.example.trim() : null
  const phonetic = typeof body.phonetic === 'string' ? body.phonetic.trim() : null
  const level = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].includes(body.level?.toUpperCase())
    ? body.level.toUpperCase()
    : 'B1'
  const topic = typeof body.topic === 'string' ? body.topic.trim() : null

  try {
    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + 1) // 1 day initially

    const vocab = await prisma.vocabularyWord.create({
      data: {
        word,
        meaning,
        example,
        phonetic,
        level,
        topic,
        intervalDays: 1,
        nextReviewDate,
      },
    })

    return {
      success: true,
      vocabulary: vocab,
    }
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Bu kelime kelime dağarcığınızda zaten mevcut.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Kelime kaydedilirken bir hata oluştu.',
    })
  }
})
