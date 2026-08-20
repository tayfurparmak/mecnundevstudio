export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  if (!body || typeof body.title !== 'string' || !body.title.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Görev başlığı zorunludur.',
    })
  }

  const title = body.title.trim()
  const description = typeof body.description === 'string' ? body.description.trim() : null
  const category = (['AI', 'ENGLISH', 'WEB', 'PYTHON', 'OTHER'].includes(body.category) ? body.category : 'WEB') as any
  const technology = typeof body.technology === 'string' ? body.technology.trim() : (body.category || 'Web')
  const topic = typeof body.topic === 'string' ? body.topic.trim() : null
  const priority = ['LOW', 'MEDIUM', 'HIGH', 'URGENT'].includes(body.priority) ? body.priority : 'MEDIUM'
  const estimatedMinutes = typeof body.estimatedMinutes === 'number' && body.estimatedMinutes >= 0 ? body.estimatedMinutes : 30
  const actualMinutes = typeof body.actualMinutes === 'number' && body.actualMinutes >= 0 ? body.actualMinutes : 0
  const status = (['TODO', 'IN_PROGRESS', 'DONE'].includes(body.status) ? body.status : 'TODO') as any
  const goalId = typeof body.goalId === 'number' && body.goalId > 0 ? body.goalId : null
  const checklists = Array.isArray(body.checklists) ? body.checklists : []

  try {
    const highestOrderTask = await prisma.task.findFirst({
      where: { status },
      orderBy: { order: 'desc' },
      select: { order: true },
    })

    const nextOrder = (highestOrderTask?.order ?? -1) + 1

    const task = await prisma.task.create({
      data: {
        title,
        description,
        category,
        technology,
        topic,
        priority,
        estimatedMinutes,
        actualMinutes,
        status,
        order: nextOrder,
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
      statusMessage: error?.message || 'Görev oluşturulurken bir hata oluştu.',
    })
  }
})
