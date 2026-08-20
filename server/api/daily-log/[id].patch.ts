const MAX_TODO_TASK_LENGTH = 255
const MAX_LEARNING_LOG_LENGTH = 5000

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const idParam = getRouterParam(event, 'id')
  const id = Number.parseInt(idParam || '', 10)

  if (Number.isNaN(id) || id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz günlük kayıt kimliği (ID).',
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
    todoTask?: string
    learningLog?: string | null
    notLearned?: string | null
    planTomorrow?: string | null
    technology?: string | null
    isCompleted?: boolean
  } = {}

  if (typeof body.todoTask === 'string') {
    const trimmed = body.todoTask.trim()
    if (!trimmed) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Görev başlığı boş bırakılamaz.',
      })
    }
    if (trimmed.length > MAX_TODO_TASK_LENGTH) {
      throw createError({
        statusCode: 400,
        statusMessage: `Görev başlığı en fazla ${MAX_TODO_TASK_LENGTH} karakter olabilir.`,
      })
    }
    updateData.todoTask = trimmed
  }

  if (typeof body.learningLog === 'string') {
    updateData.learningLog = body.learningLog.trim().slice(0, MAX_LEARNING_LOG_LENGTH)
  }

  if (typeof body.notLearned === 'string') {
    updateData.notLearned = body.notLearned.trim().slice(0, MAX_LEARNING_LOG_LENGTH)
  }

  if (typeof body.planTomorrow === 'string') {
    updateData.planTomorrow = body.planTomorrow.trim().slice(0, MAX_LEARNING_LOG_LENGTH)
  }

  if (typeof body.technology === 'string') {
    updateData.technology = body.technology.trim()
  }

  if (typeof body.isCompleted === 'boolean') {
    updateData.isCompleted = body.isCompleted
  }

  try {
    const log = await prisma.dailyLog.update({
      where: { id },
      data: updateData,
    })

    return {
      success: true,
      log,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Günlük kayıt güncellenirken bir hata oluştu.',
    })
  }
})
