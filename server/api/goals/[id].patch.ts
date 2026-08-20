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

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Güncellenecek veri bulunamadı.',
    })
  }

  const updateData: {
    title?: string
    description?: string
    category?: string
    targetDate?: string
    targetMinutes?: number
    completedMinutes?: number
    status?: string
    progress?: number
  } = {}

  if (typeof body.title === 'string' && body.title.trim()) updateData.title = body.title.trim()
  if (typeof body.description === 'string') updateData.description = body.description.trim()
  if (typeof body.category === 'string' && body.category.trim()) updateData.category = body.category.trim()
  if (typeof body.targetDate === 'string') updateData.targetDate = body.targetDate.trim()
  if (typeof body.targetMinutes === 'number') updateData.targetMinutes = Math.max(0, body.targetMinutes)
  if (typeof body.completedMinutes === 'number') updateData.completedMinutes = Math.max(0, body.completedMinutes)
  if (typeof body.status === 'string') updateData.status = body.status
  if (typeof body.progress === 'number') updateData.progress = Math.min(100, Math.max(0, body.progress))

  try {
    const goal = await prisma.goal.update({
      where: { id },
      data: updateData,
    })

    return {
      success: true,
      goal,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Hedef güncellenirken bir hata oluştu.',
    })
  }
})
