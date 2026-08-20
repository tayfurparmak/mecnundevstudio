import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || typeof body.rawNotes !== 'string' || !body.rawNotes.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Ham öğrenme notları (rawNotes) zorunludur.',
    })
  }

  const rawNotes = body.rawNotes.trim()
  const topic = typeof body.topic === 'string' ? body.topic.trim() : 'Teknik Konu'
  const skill = typeof body.skill === 'string' ? body.skill.trim() : 'Yazılım'
  const language = body.language === 'en' ? 'en' : 'tr'

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GEMINI_API_KEY sunucu ortam değişkeni tanımlı değil.',
    })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const systemInstruction = `Sen uzman bir teknik yazar ve eğitici yapay zeka asistanısın.
Görevin: Verilen ham geliştirici öğrenme notlarını temel alarak yüksek kaliteli, anlaşılır, yapılandırılmış bir teknik blog yazısı üretmek.

Kurallar:
1. Kesinlikle yalnızca verilen notları ve doğru teknik bilgileri temel al. Olmayan kütüphaneleri veya özellikleri uydurma.
2. Anlaşılır, öğretici bir teknik dil kullan.
3. Gereksiz pazarlama klişelerinden ve aşırı emojilerden kaçın.
4. Çıktı Markdown formatında olmalı (uygun ## ve ### başlıkları, kod blokları, listeler).
5. SEO uyumlu bir başlık (title) ve 1-2 cümlelik özet (summary) üret.
6. URL uyumlu bir slug önerisi üret.
7. İstenen dil: ${language === 'en' ? 'İngilizce (English)' : 'Türkçe (Turkish)'}.

Çıktını YALNIZCA geçerli bir JSON nesnesi olarak döndür. JSON şeması:
{
  "title": "SEO Uyumlu Başlık",
  "summary": "1-2 cümlelik teknik özet",
  "content": "Markdown formatında tam içerik...",
  "slug": "url-uyumlu-slug-onerisi"
}`

    const userPrompt = `Konu / Topic: ${topic}
Kategori / Yetenek: ${skill}
Dil / Language: ${language}

Ham Notlar:
${rawNotes}`

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] },
      ],
    })

    const responseText = response.text || ''

    // Clean JSON markdown fences if present
    const cleanJson = responseText
      .replace(/^```json\s*/i, '')
      .replace(/^```\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim()

    let parsedResult: any
    try {
      parsedResult = JSON.parse(cleanJson)
    } catch {
      parsedResult = {
        title: `${topic} - Öğrenme Rehberi`,
        summary: rawNotes.slice(0, 150),
        content: responseText,
        slug: slugify(topic),
      }
    }

    return {
      success: true,
      post: {
        title: parsedResult.title || topic,
        summary: parsedResult.summary || '',
        content: parsedResult.content || responseText,
        slug: slugify(parsedResult.slug || parsedResult.title || topic),
      },
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Gemini AI içerik üretimi sırasında bir hata oluştu.',
    })
  }
})
