export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İlerleme verisi bulunamadı.',
    })
  }

  const id = typeof body.id === 'number' ? body.id : (body.id ? Number.parseInt(body.id, 10) : null)
  const skillName = typeof body.skillName === 'string' ? body.skillName.trim() : null

  if (!id && !skillName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Yetenek kimliği (id) veya yetenek adı (skillName) zorunludur.',
    })
  }

  if (typeof body.percentage !== 'number' && typeof body.increment !== 'number') {
    throw createError({
      statusCode: 400,
      statusMessage: 'percentage veya increment değeri belirtilmelidir.',
    })
  }

  if (typeof body.percentage === 'number' && body.percentage < 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'İlerleme yüzdesi 0\'dan küçük olamaz.',
    })
  }

  try {
    const updatedSkill = await prisma.$transaction(async (tx) => {
      let skill = null

      if (id && id > 0) {
        skill = await tx.skillTracker.findUnique({ where: { id } })
      } else if (skillName) {
        skill = await tx.skillTracker.findUnique({ where: { skillName } })
      }

      if (!skill) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Güncellenecek yetenek kaydı bulunamadı.',
        })
      }

      let finalPercentage = skill.percentage

      if (typeof body.percentage === 'number') {
        finalPercentage = Math.min(100, Math.max(0, Math.round(body.percentage)))
      } else if (typeof body.increment === 'number') {
        finalPercentage = Math.min(100, Math.max(0, skill.percentage + Math.round(body.increment)))
      }

      return tx.skillTracker.update({
        where: { id: skill.id },
        data: {
          percentage: finalPercentage,
        },
      })
    })

    return {
      success: true,
      skill: updatedSkill,
    }
  } catch (error: any) {
    if (error?.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'İlerleme güncellenirken bir hata oluştu.',
    })
  }
})
