const MAX_TODO_TASK_LENGTH = 255
const MAX_LEARNING_LOG_LENGTH = 5000

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  if (!body || typeof body.todoTask !== 'string' || !body.todoTask.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Çalışılan konu / görev başlığı (todoTask) zorunludur.',
    })
  }

  const todoTask = body.todoTask.trim()
  if (todoTask.length > MAX_TODO_TASK_LENGTH) {
    throw createError({
      statusCode: 400,
      statusMessage: `Görev başlığı en fazla ${MAX_TODO_TASK_LENGTH} karakter olabilir. (Mevcut: ${todoTask.length})`,
    })
  }

  let learningLog: string | null = null
  if (typeof body.learningLog === 'string' && body.learningLog.trim()) {
    const trimmed = body.learningLog.trim()
    if (trimmed.length > MAX_LEARNING_LOG_LENGTH) {
      throw createError({
        statusCode: 400,
        statusMessage: `Öğrenme notu en fazla ${MAX_LEARNING_LOG_LENGTH} karakter olabilir. (Mevcut: ${trimmed.length})`,
      })
    }
    learningLog = trimmed
  }

  let notLearned: string | null = null
  if (typeof body.notLearned === 'string' && body.notLearned.trim()) {
    const trimmed = body.notLearned.trim()
    if (trimmed.length > MAX_LEARNING_LOG_LENGTH) {
      throw createError({
        statusCode: 400,
        statusMessage: `Anlaşılmayanlar notu en fazla ${MAX_LEARNING_LOG_LENGTH} karakter olabilir.`,
      })
    }
    notLearned = trimmed
  }

  let planTomorrow: string | null = null
  if (typeof body.planTomorrow === 'string' && body.planTomorrow.trim()) {
    const trimmed = body.planTomorrow.trim()
    if (trimmed.length > MAX_LEARNING_LOG_LENGTH) {
      throw createError({
        statusCode: 400,
        statusMessage: `Yarının planı en fazla ${MAX_LEARNING_LOG_LENGTH} karakter olabilir.`,
      })
    }
    planTomorrow = trimmed
  }

  const technology = typeof body.technology === 'string' && body.technology.trim()
    ? body.technology.trim()
    : 'Genel'

  const isCompleted = typeof body.isCompleted === 'boolean' ? body.isCompleted : false

  try {
    const log = await prisma.dailyLog.create({
      data: {
        todoTask,
        learningLog,
        notLearned,
        planTomorrow,
        technology,
        isCompleted,
      },
    })

    return {
      success: true,
      log,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Günlük kayıt oluşturulurken bir hata oluştu.',
    })
  }
})
