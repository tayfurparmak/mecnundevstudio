export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const level = typeof query.level === 'string' ? query.level.toUpperCase() : undefined
  const topic = typeof query.topic === 'string' ? query.topic : undefined
  const dueOnly = query.due === 'true'

  try {
    const whereClause: any = {}
    if (level) whereClause.level = level
    if (topic) whereClause.topic = topic
    if (dueOnly) whereClause.nextReviewDate = { lte: new Date() }

    const words = await prisma.vocabularyWord.findMany({
      where: whereClause,
      orderBy: [
        { nextReviewDate: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    const dueCount = await prisma.vocabularyWord.count({
      where: { nextReviewDate: { lte: new Date() } },
    })

    return {
      success: true,
      words,
      dueCount,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Kelimeler getirilirken bir hata oluştu.',
    })
  }
})
