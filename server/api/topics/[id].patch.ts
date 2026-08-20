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

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Güncellenecek veri bulunamadı.',
    })
  }

  const existingTopic = await prisma.topic.findUnique({
    where: { id },
    include: { checklists: true },
  })

  if (!existingTopic) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Konu bulunamadı.',
    })
  }

  const updateData: {
    title?: string
    technology?: string
    status?: string
    goalId?: number | null
    order?: number
  } = {}

  if (typeof body.title === 'string' && body.title.trim()) updateData.title = body.title.trim()
  if (typeof body.technology === 'string' && body.technology.trim()) updateData.technology = body.technology.trim()
  if (typeof body.status === 'string') updateData.status = body.status
  if (typeof body.goalId === 'number') updateData.goalId = body.goalId > 0 ? body.goalId : null
  if (typeof body.order === 'number') updateData.order = body.order

  try {
    const topic = await prisma.topic.update({
      where: { id },
      data: updateData,
      include: { checklists: true },
    })

    const techName = updateData.technology || existingTopic.technology
    await recalculateSkillProgress(techName)
    if (existingTopic.technology !== techName) {
      await recalculateSkillProgress(existingTopic.technology)
    }

    const currentGoalId = topic.goalId || existingTopic.goalId
    if (currentGoalId) {
      await recalculateGoalProgress(currentGoalId)
    }

    return {
      success: true,
      topic,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Konu güncellenirken bir hata oluştu.',
    })
  }
})
