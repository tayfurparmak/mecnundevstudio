export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Hedef başlığı zorunludur.',
    })
  }

  const title = body.title.trim()
  const description = typeof body.description === 'string' ? body.description.trim() : null
  const category = typeof body.category === 'string' && body.category.trim() ? body.category.trim() : 'Genel'
  const targetDate = typeof body.targetDate === 'string' && body.targetDate.trim() ? body.targetDate.trim() : 'Belirtilmedi'
  const targetMinutes = typeof body.targetMinutes === 'number' && body.targetMinutes >= 0 ? body.targetMinutes : 0
  const status = typeof body.status === 'string' ? body.status : 'IN_PROGRESS'

  try {
    const goal = await prisma.goal.create({
      data: {
        title,
        description,
        category,
        targetDate,
        targetMinutes,
        status,
        progress: 0,
      },
    })

    return {
      success: true,
      goal,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Hedef oluşturulurken bir hata oluştu.',
    })
  }
})
