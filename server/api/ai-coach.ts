import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  requireAdmin(event)
  const config = useRuntimeConfig()
  const apiKey = config.geminiApiKey || process.env.GEMINI_API_KEY

  try {
    // Gather system data from Prisma for AI analysis
    const [tasks, dailyLogs, skills, goals, notes] = await Promise.all([
      prisma.task.findMany({ take: 10, orderBy: { updatedAt: 'desc' } }),
      prisma.dailyLog.findMany({ take: 5, orderBy: { createdAt: 'desc' } }),
      prisma.skillTracker.findMany(),
      prisma.goal.findMany({ where: { status: 'IN_PROGRESS' } }),
      prisma.note.findMany({ take: 5, orderBy: { updatedAt: 'desc' } }),
    ])

    const contextSummary = {
      activeGoals: goals.map(g => g.title),
      skills: skills.map(s => `${s.skillName}: %${s.percentage}`),
      recentTasks: tasks.map(t => `${t.title} [${t.status}]`),
      recentLogs: dailyLogs.map(l => `${l.technology}: ${l.todoTask}`),
      recentNotes: notes.map(n => n.title),
    }

    if (!apiKey) {
      return {
        success: true,
        advice: 'Harika bir tempo yakaladın! Zihin haritandaki node bağlantılarını güçlendirmek için bugün yeni bir frontend/backend mimari notu ekle ve görevlerini tamamla.',
        metrics: contextSummary,
      }
    }

    const ai = new GoogleGenAI({ apiKey })
    const prompt = `You are an expert AI Software Engineering Mentor & Growth Coach. Analyze this developer's current state:
    - Active Goals: ${JSON.stringify(contextSummary.activeGoals)}
    - Skills & Progress: ${JSON.stringify(contextSummary.skills)}
    - Recent Tasks: ${JSON.stringify(contextSummary.recentTasks)}
    - Recent Journal Logs: ${JSON.stringify(contextSummary.recentLogs)}

    Provide a concise, encouraging, personalized mentorship advice in Turkish (Cyberpunk mentor persona, professional, direct, actionable). Give 1 specific recommendation on what to focus on next.`

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    })

    const advice = response.text || 'Harika ilerliyorsun! Çalışma serini koruyarak sıradaki hedefine odaklan.'

    return {
      success: true,
      advice,
      metrics: contextSummary,
    }
  } catch (error: any) {
    return {
      success: true,
      advice: 'AI Koç şu an aktif, ancak bağlantı kurulurken yerel modüse geçildi. Harika bir kodlama günü dilerim!',
      error: error?.message,
    }
  }
})
