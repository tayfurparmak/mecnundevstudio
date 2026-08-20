export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz kelime ID.',
    })
  }

  try {
    await prisma.vocabularyWord.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'Kelime başarıyla silindi.',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Kelime silinirken bir hata oluştu.',
    })
  }
})
