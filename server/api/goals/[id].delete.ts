export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz hedef ID.',
    })
  }

  try {
    await prisma.goal.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'Hedef başarıyla silindi.',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Hedef silinirken bir hata oluştu.',
    })
  }
})
