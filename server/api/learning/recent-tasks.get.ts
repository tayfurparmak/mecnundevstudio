export default defineEventHandler(async () => {
  try {
    const recentTasks = await prisma.task.findMany({
      where: {
        status: 'DONE',
      },
      orderBy: [
        { completedAt: 'desc' },
        { updatedAt: 'desc' },
      ],
      take: 6,
      select: {
        id: true,
        title: true,
        category: true,
        technology: true,
        topic: true,
        priority: true,
        completedAt: true,
        updatedAt: true,
      },
    })

    const totalCompletedCount = await prisma.task.count({
      where: { status: 'DONE' },
    })

    return {
      success: true,
      tasks: recentTasks,
      totalCompletedCount,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Tamamlanan görevler yüklenirken bir hata oluştu.',
    })
  }
})
