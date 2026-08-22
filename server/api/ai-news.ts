export interface AIDispatchItem {
  id: string
  title: string
  summary: string
  content: string
  source: string
  sourceUrl: string
  category: 'llm' | 'robotics' | 'tools' | 'research'
  date: string
  readTimeMinutes: number
  isBreaking?: boolean
  imageUrl?: string
}

export default defineEventHandler(async (event): Promise<{ success: boolean; language: string; items: AIDispatchItem[] }> => {
  const query = getQuery(event)
  const lang = (query.lang as string) || 'tr'

  const dispatches: Record<string, AIDispatchItem[]> = {
    en: [
      {
        id: 'ai-1',
        title: 'OpenAI & Anthropic Announce Next-Gen Reasoning Models with Autonomous Agent Capabilities',
        summary: 'New reasoning architectures achieve 94% on SWE-bench, enabling multi-day complex software engineering workflows without human intervention.',
        content: 'Researchers at leading AI labs have unveiled transformer architectures augmented with tree-of-thought verification loops. These models can autonomously plan, write, test, and deploy full-stack codebases while debugging memory leaks in real-time.',
        source: 'MIT Tech Review',
        sourceUrl: 'https://technologyreview.com',
        category: 'llm',
        date: '2 Hours Ago',
        readTimeMinutes: 4,
        isBreaking: true,
      },
      {
        id: 'ai-2',
        title: 'Tesla & Boston Dynamics Showcase Humanoid Robotics Integration with Neural LLM Controllers',
        summary: 'Humanoid robots are now processing spatial physics and natural language commands in sub-50ms latency using on-edge neural processors.',
        content: 'Integration of multimodal vision-language models directly into actuator control loops allows robots to adapt dynamically to unstructured environments, opening the door to universal industrial automation.',
        source: 'TechCrunch AI',
        sourceUrl: 'https://techcrunch.com',
        category: 'robotics',
        date: '5 Hours Ago',
        readTimeMinutes: 3,
      },
      {
        id: 'ai-3',
        title: 'DeepSeek Releases Open-Weight MoE Architecture Rivaling Proprietary Frontier Models',
        summary: 'Mixture-of-Experts efficiency breakthrough drastically reduces training and inference compute costs by 70% while matching state-of-the-art benchmarks.',
        content: 'The open-weight release provides developers worldwide with enterprise-grade reasoning capabilities at a fraction of previous GPU cluster requirements, accelerating democratized AI deployment.',
        source: 'ArXiv Neural',
        sourceUrl: 'https://arxiv.org',
        category: 'research',
        date: 'Yesterday',
        readTimeMinutes: 5,
      },
      {
        id: 'ai-4',
        title: 'Nuxt 4 & Nitro Edge Compute Frameworks Native AI Streaming Integration',
        summary: 'New developer tooling allows server-sent event (SSE) vector streams directly from edge workers with zero configuration.',
        content: 'Full-stack developers can now embed RAG (Retrieval-Augmented Generation) pipelines into SSR Nuxt applications with sub-10ms response times.',
        source: 'Vercel Dispatch',
        sourceUrl: 'https://vercel.com',
        category: 'tools',
        date: '2 Days Ago',
        readTimeMinutes: 3,
      },
    ],
    de: [
      {
        id: 'ai-1',
        title: 'OpenAI und Anthropic stellen KI-Modelle der nächsten Generation mit autonomen Agenten vor',
        summary: 'Neue Argumentationsarchitekturen erreichen 94% im SWE-Bench und ermöglichen mehrtägige Software-Engineering-Workflows.',
        content: 'Führende KI-Labore haben Transformer-Architekturen mit Tree-of-Thought-Verifikationsschleifen vorgestellt, die autonom Code schreiben und debuggen können.',
        source: 'MIT Tech Review',
        sourceUrl: 'https://technologyreview.com',
        category: 'llm',
        date: 'Vor 2 Stunden',
        readTimeMinutes: 4,
        isBreaking: true,
      },
      {
        id: 'ai-2',
        title: 'Humanoide Robotik erreicht Durchbruch durch multimodale KI-Steuerung in Echtzeit',
        summary: 'Roboter verarbeiten räumliche Physik und Sprachbefehle mit einer Latenz von unter 50 ms.',
        content: 'Die direkte Integration von Vision-Language-Modellen in Aktuator-Regelkreise ermöglicht die Anpassung an unstrukturierte Umgebungen.',
        source: 'TechCrunch AI',
        sourceUrl: 'https://techcrunch.com',
        category: 'robotics',
        date: 'Vor 5 Stunden',
        readTimeMinutes: 3,
      },
      {
        id: 'ai-3',
        title: 'DeepSeek veröffentlicht Open-Weight MoE-Architektur mit extrem geringem Rechenaufwand',
        summary: 'Effizienzsteigerung reduziert Rechenkosten um 70% bei gleichbleibender Spitzenleistung.',
        content: 'Die Open-Weight-Veröffentlichung bietet Entwicklern weltweit erstklassige Argumentationsfähigkeiten.',
        source: 'ArXiv Neural',
        sourceUrl: 'https://arxiv.org',
        category: 'research',
        date: 'Gestern',
        readTimeMinutes: 5,
      },
      {
        id: 'ai-4',
        title: 'Nuxt 4 & Nitro Edge Frameworks bieten native Streaming-Integration für KI',
        summary: 'Neue Entwickler-Tools ermöglichen Server-Sent-Event-Vektor-Streams direkt an der Edge.',
        content: 'Full-Stack-Entwickler können nun RAG-Pipelines mit extrem schnellen Antwortzeiten in SSR-Anwendungen einbetten.',
        source: 'Vercel Dispatch',
        sourceUrl: 'https://vercel.com',
        category: 'tools',
        date: 'Vor 2 Tagen',
        readTimeMinutes: 3,
      },
    ],
    nl: [
      {
        id: 'ai-1',
        title: 'OpenAI en Anthropic kondigen volgende generatie redeneermodellen aan met autonome agenten',
        summary: 'Nieuwe architecturen behalen 94% op SWE-bench en automatiseren complexe software-engineering.',
        content: 'Onderzoekers hebben transformer-architecturen onthuld met verificatielussen die autonoom code schrijven en debuggen.',
        source: 'MIT Tech Review',
        sourceUrl: 'https://technologyreview.com',
        category: 'llm',
        date: '2 uur geleden',
        readTimeMinutes: 4,
        isBreaking: true,
      },
      {
        id: 'ai-2',
        title: 'Humanoïde robotica bereikt doorbraak dankzij multimodale AI-controllers in realtime',
        summary: 'Robots verwerken ruimtelijke fysica en spraakopdrachten met minder dan 50ms latentie.',
        content: 'Integratie van vision-language modellen direct in actuatorkringen zorgt voor adaptieve automatisering.',
        source: 'TechCrunch AI',
        sourceUrl: 'https://techcrunch.com',
        category: 'robotics',
        date: '5 uur geleden',
        readTimeMinutes: 3,
      },
      {
        id: 'ai-3',
        title: 'DeepSeek lanceert open-weight MoE-architectuur die concurreert met propriëtaire modellen',
        summary: 'Efficiëntie doorbraak verlaagt berekeningskosten met 70% met behoud van topniveau.',
        content: 'De open-weight release biedt ontwikkelaars wereldwijd enterprise-grade redeneervermogen.',
        source: 'ArXiv Neural',
        sourceUrl: 'https://arxiv.org',
        category: 'research',
        date: 'Gisteren',
        readTimeMinutes: 5,
      },
      {
        id: 'ai-4',
        title: 'Nuxt 4 & Nitro Edge Frameworks introduceren native AI streaming',
        summary: 'Nieuwe tools maken server-sent event vector streams mogelijk direct vanaf de edge.',
        content: 'Full-stack ontwikkelaars kunnen nu RAG-pijpleidingen integreren in SSR-applicaties.',
        source: 'Vercel Dispatch',
        sourceUrl: 'https://vercel.com',
        category: 'tools',
        date: '2 dagen geleden',
        readTimeMinutes: 3,
      },
    ],
    tr: [
      {
        id: 'ai-1',
        title: 'OpenAI ve Anthropic, Otonom Ajan Yeteneklerine Sahip Yeni Nesil Akıl Yürütme Modellerini Duyurdu',
        summary: 'Yeni mimariler SWE-bench testinde %94 başarı elde ederek insan müdahalesi olmadan günlerce süren yazılım geliştirme süreçlerini otomatize ediyor.',
        content: 'Lider yapay zeka laboratuvarlarındaki araştırmacılar, düşünce ağacı doğrulama döngüleriyle güçlendirilmiş transformer mimarilerini tanıttı. Bu modeller bellek sızıntılarını gerçek zamanlı ayıklayarak tam yığın kod tabanlarını otonom olarak planlayıp dağıtabiliyor.',
        source: 'MIT Tech Review',
        sourceUrl: 'https://technologyreview.com',
        category: 'llm',
        date: '2 Saat Önce',
        readTimeMinutes: 4,
        isBreaking: true,
      },
      {
        id: 'ai-2',
        title: 'Insansı Robotik Sistemler, Nöral LLM Kontrolcüler ile Gerçek Zamanlı Mekansal Fizik İşliyor',
        summary: 'İnsansı robotlar artık uç (edge) nöral işlemciler kullanarak 50 milisaniyenin altında gecikmeyle hareket ve doğal dil komutlarını işliyor.',
        content: 'Multimodal vizyon-dil modellerinin doğrudan aktüatör kontrol döngülerine entegre edilmesi, robotların yapılandırılmamış ortamlara dinamik olarak uyum sağlamasına olanak tanıyor.',
        source: 'TechCrunch AI',
        sourceUrl: 'https://techcrunch.com',
        category: 'robotics',
        date: '5 Saat Önce',
        readTimeMinutes: 3,
      },
      {
        id: 'ai-3',
        title: 'DeepSeek, Tescilli Modellerle Rekabet Eden Açık Ağırlıklı (Open-Weight) MoE Mimarisini Yayınladı',
        summary: 'Uzmanlar karışımı (Mixture-of-Experts) verimlilik bulgusu, son teknoloji kıyaslamalarını korurken eğitim ve çıkarım maliyetlerini %70 oranında düşürüyor.',
        content: 'Açık ağırlıklı sürüm, dünya çapındaki geliştiricilere önceki GPU küme gereksinimlerinin çok altında kurumsal düzeyde akıl yürütme yetenekleri sunuyor.',
        source: 'ArXiv Neural',
        sourceUrl: 'https://arxiv.org',
        category: 'research',
        date: 'Dün',
        readTimeMinutes: 5,
      },
      {
        id: 'ai-4',
        title: 'Nuxt 4 ve Nitro Edge Altyapıları, Yerel Yapay Zeka Akış (Streaming) Desteğini Başlatıyor',
        summary: 'Yeni geliştirici araçları, ek yapılandırmaya gerek kalmadan edge çalışanlarından doğrudan sunucu gönderimli olay (SSE) vektör akışlarına izin veriyor.',
        content: 'Full-stack geliştiriciler artık 10 milisaniyenin altında yanıt süreleriyle RAG (Retrieval-Augmented Generation) boru hatlarını SSR Nuxt uygulamalarına gömebilir.',
        source: 'Vercel Dispatch',
        sourceUrl: 'https://vercel.com',
        category: 'tools',
        date: '2 Gün Önce',
        readTimeMinutes: 3,
      },
    ],
  }

  const items = dispatches[lang] || dispatches.en

  return {
    success: true,
    language: lang,
    items,
  }
})
