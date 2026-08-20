export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || !Array.isArray(body.tasks)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'tasks dizisi bekleniyor.',
    })
  }

  try {
    const updates = body.tasks.map((t: { id: number; status?: any; order?: number }) =>
      prisma.task.update({
        where: { id: t.id },
        data: {
          ...(t.status ? { status: t.status } : {}),
          ...(typeof t.order === 'number' ? { order: t.order } : {}),
        },
      })
    )

    await prisma.$transaction(updates)

    return {
      success: true,
      message: 'Görev sıralaması güncellendi.',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Toplu sıralama güncellenirken hata oluştu.',
    })
  }
})
