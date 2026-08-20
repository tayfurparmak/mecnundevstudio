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
    const trimmed = body.learningLog.trim()
    if (trimmed.length > MAX_LEARNING_LOG_LENGTH) {
      throw createError({
        statusCode: 400,
        statusMessage: `Öğrenme notu en fazla ${MAX_LEARNING_LOG_LENGTH} karakter olabilir.`,
      })
    }
    updateData.learningLog = trimmed || null
  } else if (body.learningLog === null) {
    updateData.learningLog = null
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
    if (error?.code === 'P2025') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Güncellenmek istenen kayıt bulunamadı.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Günlük kayıt güncellenirken bir hata oluştu.',
    })
  }
})
