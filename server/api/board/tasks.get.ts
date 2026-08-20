export default defineEventHandler(async (event) => {
  requireAdmin(event)

  try {
    const tasks = await prisma.task.findMany({
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
        { createdAt: 'asc' },
      ],
    })

    return {
      success: true,
      tasks,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Görevler yüklenirken bir hata oluştu.',
    })
  }
})
