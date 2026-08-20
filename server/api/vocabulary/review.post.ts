const INTERVAL_STEPS = [1, 3, 7, 14, 30]

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.wordId !== 'number' || body.wordId <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz kelime ID.',
    })
  }

  const wordId = body.wordId
  const remembered = typeof body.remembered === 'boolean' ? body.remembered : true

  try {
    const existing = await prisma.vocabularyWord.findUnique({
      where: { id: wordId },
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Kelime bulunamadı.',
      })
    }

    let nextIntervalDays = 1

    if (remembered) {
      const currentIdx = INTERVAL_STEPS.indexOf(existing.intervalDays)
      if (currentIdx !== -1 && currentIdx < INTERVAL_STEPS.length - 1) {
        nextIntervalDays = INTERVAL_STEPS[currentIdx + 1] ?? 30
      } else {
        nextIntervalDays = 30
      }
    } else {
      nextIntervalDays = 1
    }

    const nextReviewDate = new Date()
    nextReviewDate.setDate(nextReviewDate.getDate() + nextIntervalDays)

    const updated = await prisma.vocabularyWord.update({
      where: { id: wordId },
      data: {
        reviewCount: { increment: 1 },
        intervalDays: nextIntervalDays,
        nextReviewDate,
        lastReviewedAt: new Date(),
      },
    })

    return {
      success: true,
      word: updated,
      message: remembered ? `Harika! Kelime ${nextIntervalDays} gün sonra tekrar sorulacak.` : 'Kelime yarın tekrar hatırlatılacak.',
    }
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Kelime tekrar durumu kaydedilirken bir hata oluştu.',
    })
  }
})
