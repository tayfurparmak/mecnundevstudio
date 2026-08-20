import { GoogleGenAI } from '@google/genai'

export default defineEventHandler(async (event) => {
  requireAdmin(event)

  const body = await readBody(event)
  if (!body || !Array.isArray(body.words) || body.words.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Lütfen hikaye üretimi için en az bir kelime seçin.',
    })
  }

  const words = body.words.filter((w: any) => typeof w === 'string' && w.trim()).map((w: string) => w.trim())
  const level = typeof body.level === 'string' ? body.level : 'B1'

  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw createError({
      statusCode: 500,
      statusMessage: 'GEMINI_API_KEY sunucu ortam değişkeni tanımlı değil.',
    })
  }

  try {
    const ai = new GoogleGenAI({ apiKey })

    const systemInstruction = `You are an expert English language educator and storyteller.
Your task is to write a short, engaging, and educational practice story that naturally incorporates the given vocabulary words.

Rules:
1. Target CEFR English Level: ${level}.
2. You MUST use every single word provided in the list.
3. In the English story, bold the target words (e.g. **achieve**).
4. Provide a brief Turkish summary / vocabulary glossary at the end.
5. Keep the story concise (150-250 words), clear, and inspiring.

Return ONLY a valid JSON object matching this schema:
{
  "title": "Story Title",
  "storyEnglish": "English story with **bolded** target words...",
  "storyTurkish": "Hikayenin Türkçe çevirisi veya açıklaması...",
  "usedWords": ["word1", "word2"]
}`

    const userPrompt = `Target Words: ${words.join(', ')}
Level: ${level}`

    const response = await ai.models.generateContent({
      model: 'gemini-3.6-flash',
      contents: [
        { role: 'user', parts: [{ text: `${systemInstruction}\n\n${userPrompt}` }] },
      ],
    })

    const responseText = response.text || ''
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
        title: `Story with: ${words.join(', ')}`,
        storyEnglish: responseText,
        storyTurkish: '',
        usedWords: words,
      }
    }

    return {
      success: true,
      story: parsedResult,
    }
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: error?.message || 'Gemini AI İngilizce hikaye üretimi sırasında bir hata oluştu.',
    })
  }
})
