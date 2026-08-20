export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Konu başlığı zorunludur.',
    })
  }

  const title = body.title.trim()
  const technology = typeof body.technology === 'string' && body.technology.trim() ? body.technology.trim() : 'Genel'
  const status = typeof body.status === 'string' ? body.status : 'TODO'
  const goalId = typeof body.goalId === 'number' && body.goalId > 0 ? body.goalId : null
  const checklists = Array.isArray(body.checklists) ? body.checklists : []

  try {
    const topic = await prisma.topic.create({
      data: {
        title,
        technology,
        status,
        goalId,
        checklists: {
          create: checklists
            .filter((c: any) => c && typeof c.title === 'string' && c.title.trim())
            .map((c: any) => ({
              title: c.title.trim(),
              isCompleted: typeof c.isCompleted === 'boolean' ? c.isCompleted : false,
            })),
        },
      },
      include: {
        checklists: true,
      },
    })

    // Recalculate skill and goal progress
    await recalculateSkillProgress(technology)
    if (goalId) {
      await recalculateGoalProgress(goalId)
    }

    return {
      success: true,
      topic,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Konu oluşturulurken bir hata oluştu.',
    })
  }
})
