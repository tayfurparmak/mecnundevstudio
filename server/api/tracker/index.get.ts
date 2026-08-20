const DEFAULT_SKILLS = [
  { skillName: 'Yapay Zeka (AI & Prompt Engineering)', percentage: 70 },
  { skillName: 'Teknik İngilizce (B2 Seviyesi)', percentage: 60 },
  { skillName: 'Frontend / Nuxt 4 & Tailwind CSS', percentage: 85 },
]

export default defineEventHandler(async () => {
  try {
    let skills = await prisma.skillTracker.findMany({
      orderBy: { id: 'asc' },
    })

    // If database is empty, seed defaults in a transaction
    if (skills.length === 0) {
      await prisma.$transaction(
        DEFAULT_SKILLS.map((skill) =>
          prisma.skillTracker.upsert({
            where: { skillName: skill.skillName },
            update: {},
            create: skill,
          })
        )
      )

      skills = await prisma.skillTracker.findMany({
        orderBy: { id: 'asc' },
      })
    }

    return {
      success: true,
      skills,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Yetenek ilerlemeleri getirilirken hata oluştu.',
    })
  }
})
