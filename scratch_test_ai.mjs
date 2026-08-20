import { GoogleGenAI } from '@google/genai'
import fs from 'fs'

const env = fs.readFileSync('.env', 'utf-8')
const match = env.match(/GEMINI_API_KEY="?([^"\r\n]+)"?/)
const apiKey = match ? match[1] : null

const ai = new GoogleGenAI({ apiKey })

async function main() {
  const models = ['gemini-3.6-flash', 'gemini-3.1-pro-preview', 'gemini-3.5-flash', 'gemini-3.1-flash', 'gemini-2.5-flash-native-audio-latest']
  for (const m of models) {
    try {
      console.log(`Testing ${m}...`)
      const res = await ai.models.generateContent({
        model: m,
        contents: 'Merhaba, bana 3 kelimelik Türkçe bir selam yaz.',
      })
      console.log(`SUCCESS with ${m}:\n${res.text}`)
      break
    } catch (e) {
      console.log(`FAILED ${m}:`, e.message)
    }
  }
}

main().catch(console.error)
