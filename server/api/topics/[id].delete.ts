export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz konu ID.',
    })
  }

  try {
    const existing = await prisma.topic.findUnique({
      where: { id },
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Silinecek konu bulunamadı.',
      })
    }

    await prisma.topic.delete({
      where: { id },
    })

    await recalculateSkillProgress(existing.technology)
    if (existing.goalId) {
      await recalculateGoalProgress(existing.goalId)
    }

    return {
      success: true,
      message: 'Konu başarıyla silindi.',
    }
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Konu silinirken bir hata oluştu.',
    })
  }
})
