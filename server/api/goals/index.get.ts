export default defineEventHandler(async (event) => {
  requireAdmin(event)

  try {
    const goals = await prisma.goal.findMany({
      include: {
        topics: {
          include: {
            checklists: true,
          },
        },
        tasks: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    })

    return {
      success: true,
      goals,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Hedefler getirilirken bir hata oluştu.',
    })
  }
})
