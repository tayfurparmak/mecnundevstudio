export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz not ID.',
    })
  }

  try {
    await prisma.learningNote.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'Öğrenme notu başarıyla silindi.',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Öğrenme notu silinirken bir hata oluştu.',
    })
  }
})
