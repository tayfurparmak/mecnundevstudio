export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const technology = typeof query.technology === 'string' ? query.technology : undefined

  try {
    const notes = await prisma.learningNote.findMany({
      where: {
        ...(technology ? { technology: { equals: technology, mode: 'insensitive' } } : {}),
      },
      orderBy: { createdAt: 'desc' },
    })

    return {
      success: true,
      notes,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Öğrenme notları getirilirken bir hata oluştu.',
    })
  }
})
