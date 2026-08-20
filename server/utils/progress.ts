export async function recalculateSkillProgress(technologyName: string): Promise<number> {
  if (!technologyName) return 0

  const topics = await prisma.topic.findMany({
    where: {
      technology: {
        equals: technologyName,
        mode: 'insensitive',
      },
    },
    include: {
      checklists: true,
    },
  })

  if (topics.length === 0) {
    return 0
  }

  // Count topics that are marked DONE
  const completedTopics = topics.filter((t) => t.status === 'DONE').length
  const calculatedPercentage = Math.min(100, Math.max(0, Math.round((completedTopics / topics.length) * 100)))

  // Atomically update SkillTracker
  await prisma.skillTracker.upsert({
    where: { skillName: technologyName },
    update: { percentage: calculatedPercentage },
    create: { skillName: technologyName, percentage: calculatedPercentage },
  })

  return calculatedPercentage
}

export async function recalculateGoalProgress(goalId: number): Promise<number> {
  if (!goalId || goalId <= 0) return 0

  const topics = await prisma.topic.findMany({
    where: { goalId },
  })

  if (topics.length === 0) {
    return 0
  }

  const completed = topics.filter((t) => t.status === 'DONE').length
  const progress = Math.min(100, Math.max(0, Math.round((completed / topics.length) * 100)))

  await prisma.goal.update({
    where: { id: goalId },
    data: {
      progress,
      ...(progress === 100 ? { status: 'COMPLETED' } : {}),
    },
  })

  return progress
}
