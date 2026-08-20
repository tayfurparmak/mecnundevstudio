export default defineEventHandler(async (event) => {
  requireAdmin(event)

  try {
    const logs = await prisma.dailyLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      logs,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Günlük kayıtlar getirilirken bir hata oluştu.',
    })
  }
})
