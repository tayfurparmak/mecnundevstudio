export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const { technology, durationMinutes, todoTask, learningLog, notLearned, planTomorrow } = body

  if (!learningLog || !learningLog.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bugün ne öğrendiğinizi özetleyen not alanı zorunludur.',
    })
  }

  const duration = Number(durationMinutes) || 0
  const now = new Date()
  const todayStr = now.toISOString().split('T')[0] || ''

  try {
    const [dailyLog, activity] = await prisma.$transaction(async (tx) => {
      // 1. Create Daily Log entry
      const log = await tx.dailyLog.create({
        data: {
          todoTask: todoTask?.trim() || `${technology || 'Genel'} Çalışması`,
          learningLog: learningLog.trim(),
          notLearned: notLearned?.trim() || null,
          planTomorrow: planTomorrow?.trim() || null,
          technology: technology?.trim() || null,
          isCompleted: true,
        },
      })

      // 2. Create LearningActivity if duration > 0
      let act = null
      if (duration > 0) {
        act = await tx.learningActivity.create({
          data: {
            technology: technology?.trim() || 'Genel',
            topic: todoTask?.trim() || undefined,
            durationMinutes: duration,
            date: todayStr,
            note: learningLog.slice(0, 100),
          },
        })
      }

      return [log, act]
    })

    return {
      success: true,
      dailyLog,
      activity,
      message: 'Gün sonu kapanışı ve çalışma süresi başarıyla kaydedildi! 🌟',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Gün sonu kapanışı kaydedilirken bir hata oluştu.',
    })
  }
})
