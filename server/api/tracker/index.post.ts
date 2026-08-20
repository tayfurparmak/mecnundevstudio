export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)

  if (!body || typeof body.skillName !== 'string' || !body.skillName.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yetenek / Konu başlığı (skillName) zorunludur.',
    })
  }

  const skillName = body.skillName.trim()
  let percentage = typeof body.percentage === 'number' ? body.percentage : 0

  if (percentage < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İlerleme yüzdesi 0\'dan küçük olamaz.',
    })
  }

  percentage = Math.min(100, Math.max(0, Math.round(percentage)))

  try {
    const skill = await prisma.skillTracker.create({
      data: {
        skillName,
        percentage,
      },
    })

    return {
      success: true,
      skill,
    }
  } catch (error: any) {
    if (error?.code === 'P2002') {
      throw createError({
        statusCode: 409,
        statusMessage: 'Bu isimde bir yetenek zaten mevcut.',
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Yetenek oluşturulurken bir hata oluştu.',
    })
  }
})
