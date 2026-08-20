export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz görev kimliği (ID).',
    })
  }

  try {
    await prisma.task.delete({
      where: { id },
    })

    return {
      success: true,
      message: 'Görev başarıyla silindi.',
    }
  } catch (error: any) {
    if (error?.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Silinmek istenen görev bulunamadı.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Görev silinirken bir hata oluştu.',
    })
  }
})
