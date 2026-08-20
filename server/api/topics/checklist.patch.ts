export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.id !== 'number' || body.id <= 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Geçersiz checklist item ID.',
    })
  }

  const checklistId = body.id
  const isCompleted = typeof body.isCompleted === 'boolean' ? body.isCompleted : undefined

  try {
    const existing = await prisma.checklistItem.findUnique({
      where: { id: checklistId },
      include: { topic: { include: { checklists: true } } },
    })

    if (!existing) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Checklist maddesi bulunamadı.',
      })
    }

    const newCompleted = isCompleted !== undefined ? isCompleted : !existing.isCompleted

    const updatedItem = await prisma.checklistItem.update({
      where: { id: checklistId },
      data: { isCompleted: newCompleted },
    })

    if (existing.topic) {
      // Check all sibling checklist items
      const allChecklists = await prisma.checklistItem.findMany({
        where: { topicId: existing.topic.id },
      })

      const allDone = allChecklists.length > 0 && allChecklists.every((c) => c.id === checklistId ? newCompleted : c.isCompleted)
      const newTopicStatus = allDone ? 'DONE' : allChecklists.some((c) => c.id === checklistId ? newCompleted : c.isCompleted) ? 'IN_PROGRESS' : 'TODO'

      await prisma.topic.update({
        where: { id: existing.topic.id },
        data: { status: newTopicStatus },
      })

      await recalculateSkillProgress(existing.topic.technology)
      if (existing.topic.goalId) {
        await recalculateGoalProgress(existing.topic.goalId)
      }
    }

    return {
      success: true,
      checklistItem: updatedItem,
    }
  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Checklist güncellenirken bir hata oluştu.',
    })
  }
})
