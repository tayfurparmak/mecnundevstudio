export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz görev ID.',
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
    description?: string | null
    category?: any
    technology?: string | null
    topic?: string | null
    priority?: string
    estimatedMinutes?: number
    actualMinutes?: number
    status?: any
    order?: number
    goalId?: number | null
    completedAt?: Date | null
  } = {}

  if (typeof body.title === 'string' && body.title.trim()) updateData.title = body.title.trim()
  if (typeof body.description === 'string') updateData.description = body.description.trim()
  if (['AI', 'ENGLISH', 'WEB', 'PYTHON', 'OTHER'].includes(body.category)) updateData.category = body.category
  if (typeof body.technology === 'string') updateData.technology = body.technology.trim()
  if (typeof body.topic === 'string') updateData.topic = body.topic.trim()
  if (['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(body.priority)) updateData.priority = body.priority
  if (typeof body.estimatedMinutes === 'number') updateData.estimatedMinutes = Math.max(0, body.estimatedMinutes)
  if (typeof body.actualMinutes === 'number') updateData.actualMinutes = Math.max(0, body.actualMinutes)
  if (typeof body.order === 'number') updateData.order = body.order
  if (typeof body.goalId === 'number') updateData.goalId = body.goalId > 0 ? body.goalId : null

  if (['TODO', 'IN_PROGRESS', 'DONE'].includes(body.status)) {
    updateData.status = body.status
    if (body.status === 'DONE') {
      updateData.completedAt = new Date()
    } else {
      updateData.completedAt = null
    }
  }

  try {
    const task = await prisma.task.update({
      where: { id },
      data: updateData,
      include: {
        checklists: true,
        goal: { select: { id: true, title: true } },
      },
    })

    return {
      success: true,
      task,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Görev güncellenirken bir hata oluştu.',
    })
  }
})
