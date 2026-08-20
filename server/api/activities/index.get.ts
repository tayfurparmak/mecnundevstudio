export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const query = getQuery(event)
  const limit = typeof query.limit === 'string' && /^\d+$/.test(query.limit) ? Number.parseInt(query.limit, 10) : 50

  try {
    const activities = await prisma.learningActivity.findMany({
      orderBy: { createdAt: 'desc' },
      take: limit,
    })

    return {
      success: true,
      activities,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Aktiviteler getirilirken bir hata oluştu.',
    })
  }
})
