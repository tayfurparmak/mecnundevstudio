export default defineEventHandler(async (event) => {
  requireAdmin(event)

  try {
    const now = new Date()
    const todayStr = now.toISOString().split('T')[0] || ''

    // 1. Daily Target & Activities for today
    const [todayTarget, todayActivities] = await Promise.all([
      prisma.dailyTarget.findUnique({ where: { date: todayStr } }),
      prisma.learningActivity.findMany({ where: { date: todayStr } }),
    ])

    const todayActualMinutes = todayActivities.reduce((acc, act) => acc + act.durationMinutes, 0)
    const todayPlannedMinutes = todayTarget?.plannedMinutes ?? 120
    const todayPerformance = todayPlannedMinutes > 0
      ? Math.round((todayActualMinutes / todayPlannedMinutes) * 100)
      : 0
    const todayDifferenceMinutes = todayActualMinutes - todayPlannedMinutes

    // 2. Weekly calculation (last 7 days)
    const last7Days: { dateStr: string; label: string }[] = []
    const dayNames = ['Paz', 'Pzt', 'Sal', 'Çar', 'Per', 'Cum', 'Cmt']

    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dStr = d.toISOString().split('T')[0] || ''
      const label = dayNames[d.getDay()] || ''
      last7Days.push({ dateStr: dStr, label })
    }

    const [weeklyTargets, weeklyActivities] = await Promise.all([
      prisma.dailyTarget.findMany({
        where: { date: { in: last7Days.map((d) => d.dateStr) } },
      }),
      prisma.learningActivity.findMany({
        where: { date: { in: last7Days.map((d) => d.dateStr) } },
      }),
    ])

    const weeklyChart = last7Days.map(({ dateStr, label }) => {
      const target = weeklyTargets.find((t) => t.date === dateStr)
      const acts = weeklyActivities.filter((a) => a.date === dateStr)
      const actual = acts.reduce((sum, a) => sum + a.durationMinutes, 0)
      const planned = target?.plannedMinutes ?? 120
      return {
        date: dateStr,
        label,
        planned,
        actual,
      }
    })

    const weeklyTotalPlanned = weeklyChart.reduce((sum, c) => sum + c.planned, 0)
    const weeklyTotalActual = weeklyChart.reduce((sum, c) => sum + c.actual, 0)
    const weeklyDifference = weeklyTotalActual - weeklyTotalPlanned

    // 3. Streak Calculation (Consecutive days with at least 1 activity)
    const allActivityDates = await prisma.learningActivity.findMany({
      select: { date: true },
      distinct: ['date'],
      orderBy: { date: 'desc' },
    })

    const dateSet = new Set(allActivityDates.map((a) => a.date))
    let streak = 0
    const checkDate = new Date()

    const checkDateStr = checkDate.toISOString().split('T')[0] || ''
    if (!dateSet.has(checkDateStr)) {
      checkDate.setDate(checkDate.getDate() - 1)
    }

    while (true) {
      const dStr = checkDate.toISOString().split('T')[0] || ''
      if (dateSet.has(dStr)) {
        streak++
        checkDate.setDate(checkDate.getDate() - 1)
      } else {
        break
      }
    }

    // 4. Topic Counts
    const allTopics = await prisma.topic.findMany({
      select: { status: true },
    })
    const completedTopicsCount = allTopics.filter((t) => t.status === 'DONE').length
    const inProgressTopicsCount = allTopics.filter((t) => t.status === 'IN_PROGRESS').length
    const todoTopicsCount = allTopics.filter((t) => t.status === 'TODO').length

    // 5. Tasks Breakdown (Database Aggregation)
    const taskGroupCounts = await prisma.task.groupBy({
      by: ['status'],
      _count: { id: true },
    })

    const taskCountsMap: Record<string, number> = {
      TODO: 0,
      IN_PROGRESS: 0,
      DONE: 0,
    }
    for (const g of taskGroupCounts) {
      taskCountsMap[g.status] = g._count.id
    }
    const totalTasksCount = (taskCountsMap.TODO ?? 0) + (taskCountsMap.IN_PROGRESS ?? 0) + (taskCountsMap.DONE ?? 0)

    // 6. Blog Posts Breakdown (Database Aggregation)
    const [totalPostsCount, publishedPostsCount] = await Promise.all([
      prisma.post.count(),
      prisma.post.count({ where: { isPublished: true } }),
    ])
    const draftPostsCount = totalPostsCount - publishedPostsCount

    // 7. Daily Logs (Database Aggregation)
    const totalDailyLogsCount = await prisma.dailyLog.count()

    // 8. Learning Notes Count
    const totalNotesCount = await prisma.learningNote.count()

    // 9. Skills from SkillTracker
    const skills = await prisma.skillTracker.findMany({
      orderBy: { percentage: 'desc' },
    })

    // 10. Goals
    const goals = await prisma.goal.findMany({
      orderBy: { createdAt: 'desc' },
    })

    // 11. English Vocabulary stats
    const [totalWords, dueForReviewCount, wordsByLevel] = await Promise.all([
      prisma.vocabularyWord.count(),
      prisma.vocabularyWord.count({
        where: { nextReviewDate: { lte: now } },
      }),
      prisma.vocabularyWord.groupBy({
        by: ['level'],
        _count: { id: true },
      }),
    ])

    // 12. Recent Activities (Recent tasks & duration activities)
    const [recentTasks, recentActivitiesList] = await Promise.all([
      prisma.task.findMany({
        where: { status: 'DONE' },
        orderBy: [{ completedAt: 'desc' }, { updatedAt: 'desc' }],
        take: 4,
        select: {
          id: true,
          title: true,
          technology: true,
          topic: true,
          completedAt: true,
          updatedAt: true,
        },
      }),
      prisma.learningActivity.findMany({
        orderBy: { createdAt: 'desc' },
        take: 4,
        select: {
          id: true,
          technology: true,
          topic: true,
          durationMinutes: true,
          date: true,
          createdAt: true,
        },
      }),
    ])

    return {
      success: true,
      today: {
        date: todayStr,
        plannedMinutes: todayPlannedMinutes,
        actualMinutes: todayActualMinutes,
        differenceMinutes: todayDifferenceMinutes,
        performancePercentage: todayPerformance,
        completedTopicsCount,
        inProgressTopicsCount,
        todoTopicsCount,
      },
      week: {
        totalPlannedMinutes: weeklyTotalPlanned,
        totalActualMinutes: weeklyTotalActual,
        differenceMinutes: weeklyDifference,
        chart: weeklyChart,
      },
      streak,
      tasks: {
        total: totalTasksCount,
        todo: taskCountsMap.TODO ?? 0,
        inProgress: taskCountsMap.IN_PROGRESS ?? 0,
        completed: taskCountsMap.DONE ?? 0,
      },
      posts: {
        total: totalPostsCount,
        published: publishedPostsCount,
        draft: draftPostsCount,
      },
      dailyLogs: {
        total: totalDailyLogsCount,
      },
      notes: {
        total: totalNotesCount,
      },
      skills,
      goals,
      vocabulary: {
        totalWords,
        dueForReviewCount,
        levels: wordsByLevel.map((l) => ({ level: l.level, count: l._count.id })),
      },
      recent: {
        tasks: recentTasks,
        activities: recentActivitiesList,
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Analitik verileri hesaplanırken bir hata oluştu.',
    })
  }
})
