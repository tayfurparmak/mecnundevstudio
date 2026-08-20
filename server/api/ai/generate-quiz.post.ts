import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  const { noteContent, topic, technology } = body

  if (!noteContent || !noteContent.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Quiz üretimi için not içeriği zorunludur.',
    })
  }

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GEMINI_API_KEY environment variable tanımlı değil.',
    })
  }

  const ai = new GoogleGenAI({ apiKey })

  const systemPrompt = `Sen kıdemli bir yazılım eğitmeni ve teknik koçsun.
Görevin, sana verilen öğrenme notlarını analiz ederek yazılımcının konuyu ne kadar anladığını ölçen 3 soruluk interaktif bir quiz (çoktan seçmeli test) üretmektir.

Kurallar:
- Sadece verilen teknik nottaki bilgileri temel al.
- Her soru için 4 seçenek (A, B, C, D) oluştur.
- Seçenekler 'options' array'inde 4 string olarak yer almalıdır.
- 'correctIndex' doğru seçeneğin 0 tabanlı indeksi (0, 1, 2 veya 3) olmalıdır.
- 'explanation' alanında cevabın neden doğru olduğunu açıklayan 1-2 cümlelik teknik açıklama yaz.
- Çıktıyı SADECE geçerli bir JSON array formatında ver. Ekstra açıklama veya markdown backtick ekleme.

Format örneği:
[
  {
    "question": "Python list comprehension syntax'ı nasıldır?",
    "options": ["[x for x in list]", "{x: x in list}", "(for x in list)", "list(x, in)"],
    "correctIndex": 0,
    "explanation": "List comprehension köşeli parantez içinde döngü ve ifade yazılarak oluşturulur."
  }
]`

  const userPrompt = `Teknoloji: ${technology || 'Yazılım'}
Konu: ${topic || 'Öğrenme Notu'}

Not İçeriği:
${noteContent.slice(0, 4000)}`

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] },
      ],
    })

    const rawText = response.text || ''
    const cleanedText = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim()

    let quiz: any[] = []
    try {
      quiz = JSON.parse(cleanedText)
    } catch {
      throw new Error('AI geçerli bir JSON quiz formatı üretemedi.')
    }

    if (!Array.isArray(quiz) || quiz.length === 0) {
      throw new Error('Quiz soruları listelenemedi.')
    }

    return {
      success: true,
      quiz,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Quiz üretilirken bir hata oluştu.',
    })
  }
})
