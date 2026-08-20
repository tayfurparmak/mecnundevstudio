<template>
  <div 
    class="markdown-content text-slate-300 leading-relaxed space-y-4 text-sm sm:text-base font-sans"
    v-html="renderedHtml"
  ></div>
</template>

<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    content: string
  }>(),
  {
    content: '',
  }
)

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function safeUrl(url: string): string {
  const trimmed = url.trim()
  if (/^(https?:\/\/|\/|mailto:)/i.test(trimmed)) {
    return escapeHtml(trimmed)
  }
  return '#'
}

function safeImageUrl(url: string): string {
  const trimmed = url.trim()
  if (/^(https?:\/\/|\/|data:image\/)/i.test(trimmed)) {
    return escapeHtml(trimmed)
  }
  return '#'
}

const renderedHtml = computed(() => {
  if (!props.content) return ''

  // 1. Sanitize all raw HTML tags first
  let text = escapeHtml(props.content)

  // 2. Fenced Code Blocks: ```code```
  text = text.replace(/```([a-zA-Z0-9_-]*)\n([\s\S]*?)```/g, (_match, _lang, code) => {
    return `<pre class="p-4 my-4 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300 font-mono text-xs overflow-x-auto"><code>${code.trim()}</code></pre>`
  })

  // 3. Inline Code: `code`
  text = text.replace(/`([^`]+)`/g, '<code class="px-1.5 py-0.5 rounded bg-slate-800/80 border border-slate-700/80 text-indigo-300 font-mono text-xs">$1</code>')

  // 4. Headings
  text = text.replace(/^### (.*$)/gim, '<h3 class="text-lg font-bold text-white mt-6 mb-2">$1</h3>')
  text = text.replace(/^## (.*$)/gim, '<h2 class="text-xl font-bold text-white mt-8 mb-3 pb-1 border-b border-slate-800">$1</h2>')
  text = text.replace(/^# (.*$)/gim, '<h1 class="text-2xl sm:text-3xl font-extrabold text-white mt-8 mb-4">$1</h1>')

  // 5. Blockquotes: > quote
  text = text.replace(/^\> (.*$)/gim, '<blockquote class="border-l-4 border-indigo-500 pl-4 py-1.5 my-3 bg-indigo-950/20 rounded-r-lg text-slate-400 italic text-xs sm:text-sm">$1</blockquote>')

  // 6. Bold, Italic, Strikethrough
  text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-white">$1</strong>')
  text = text.replace(/\*(.*?)\*/g, '<em class="italic text-slate-200">$1</em>')
  text = text.replace(/~~(.*?)~~/g, '<del class="line-through text-slate-500">$1</del>')

  // 7a. Images: ![alt](url) (Processed BEFORE links)
  text = text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_match, alt, url) => {
    const safeSrc = safeImageUrl(url)
    return `<figure class="my-6 space-y-2 max-w-full"><img src="${safeSrc}" alt="${alt}" class="rounded-2xl border border-slate-800 max-w-full h-auto shadow-md mx-auto block" loading="lazy" />${alt ? `<figcaption class="text-xs text-slate-500 text-center font-sans italic">${alt}</figcaption>` : ''}</figure>`
  })

  // 7b. Links: [title](url)
  text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, title, url) => {
    const safeHref = safeUrl(url)
    return `<a href="${safeHref}" target="_blank" rel="noopener noreferrer" class="text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition">${title}</a>`
  })

  // 8. Unordered Lists: - item or * item
  text = text.replace(/^(?:-|\*)\s+(.*)$/gim, '<li class="ml-4 list-disc text-slate-300">$1</li>')

  // 9. Paragraphs and Line Breaks
  const paragraphs = text.split(/\n\s*\n/)
  return paragraphs
    .map((p) => {
      const trimmed = p.trim()
      if (!trimmed) return ''
      if (
        trimmed.startsWith('<h1') ||
        trimmed.startsWith('<h2') ||
        trimmed.startsWith('<h3') ||
        trimmed.startsWith('<pre') ||
        trimmed.startsWith('<blockquote') ||
        trimmed.startsWith('<li') ||
        trimmed.startsWith('<figure')
      ) {
        return trimmed
      }
      return `<p class="leading-relaxed">${trimmed.replace(/\n/g, '<br />')}</p>`
    })
    .join('\n')
})
</script>

<style scoped>
.markdown-content :deep(pre) {
  tab-size: 2;
}
</style>
