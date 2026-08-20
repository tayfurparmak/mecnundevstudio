export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const technology = typeof query.technology === 'string' ? query.technology : undefined
  const goalId = typeof query.goalId === 'string' && /^\d+$/.test(query.goalId) ? Number.parseInt(query.goalId, 10) : undefined

  try {
    const topics = await prisma.topic.findMany({
      where: {
        ...(technology ? { technology: { equals: technology, mode: 'insensitive' } } : {}),
        ...(goalId ? { goalId } : {}),
      },
      include: {
        checklists: {
          orderBy: { id: 'asc' },
        },
        goal: {
          select: { id: true, title: true, category: true },
        },
      },
      orderBy: [
        { order: 'asc' },
        { createdAt: 'desc' },
      ],
    })

    return {
      success: true,
      topics,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Konular getirilirken bir hata oluştu.',
    })
  }
})
