export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.durationMinutes !== 'number' || body.durationMinutes <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçerli bir çalışma süresi (dakika) girilmelidir.',
    })
  }

  const durationMinutes = Math.min(1440, Math.round(body.durationMinutes))
  const technology = typeof body.technology === 'string' && body.technology.trim() ? body.technology.trim() : 'Genel'
  const topic = typeof body.topic === 'string' ? body.topic.trim() : null
  const note = typeof body.note === 'string' ? body.note.trim() : null

  // Date format: YYYY-MM-DD
  const now = new Date()
  const todayStr = typeof body.date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(body.date)
    ? body.date
    : now.toISOString().split('T')[0]

  try {
    const activity = await prisma.learningActivity.create({
      data: {
        date: todayStr,
        technology,
        topic,
        durationMinutes,
        note,
      },
    })

    // Update DailyTarget actualMinutes
    await prisma.dailyTarget.upsert({
      where: { date: todayStr },
      update: {
        actualMinutes: { increment: durationMinutes },
      },
      create: {
        date: todayStr,
        plannedMinutes: 120,
        actualMinutes: durationMinutes,
      },
    })

    return {
      success: true,
      activity,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Aktivite kaydedilirken bir hata oluştu.',
    })
  }
})
