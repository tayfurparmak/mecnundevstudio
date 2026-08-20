import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.topic !== 'string' || !body.topic.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Konu başlığı zorunludur.',
    })
  }

  const topic = body.topic.trim()
  const technology = typeof body.technology === 'string' ? body.technology.trim() : 'Teknoloji'
  const subtopics = Array.isArray(body.subtopics) ? body.subtopics.join(', ') : ''

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GEMINI_API_KEY sunucu ortam değişkeni tanımlı değil.',
    })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const systemInstruction = `Sen uzman bir yazılım eğitmenisin.
Görevin: Yeni tamamlanan bir teknik konu hakkında geliştiricinin bilgisini pekiştirecek, 3-4 maddelik hap bilgiler içeren, net ve pratik bir özet hazırlamak.

Kurallar:
1. Kısa, doğrudan ve teknik olarak doğru ol.
2. Önemli anahtar noktaları ve varsa sık yapılan bir hatayı (gotcha) belirt.
3. Markdown formatında üret.`

    const userPrompt = `Teknoloji: ${technology}
Tamamlanan Konu: ${topic}
İşlenen Alt Maddeler: ${subtopics || 'Genel Konu'}`

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] },
      ],
    })

    return {
      success: true,
      topic,
      summary: response.text || '',
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Gemini AI konu özeti üretimi sırasında bir hata oluştu.',
    })
  }
})
