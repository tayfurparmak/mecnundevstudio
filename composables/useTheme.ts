export const useTheme = () => {
  const theme = useState<'dark' | 'light'>('mecnun_theme', () => 'dark')

  const initTheme = () => {
    if (process.client) {
      const saved = localStorage.getItem('mecnun_theme') as 'dark' | 'light' | null
      if (saved && (saved === 'dark' || saved === 'light')) {
        theme.value = saved
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        theme.value = prefersDark ? 'dark' : 'dark' // default dark
      }
      applyTheme(theme.value)
    }
  }

  const applyTheme = (val: 'dark' | 'light') => {
    if (process.client) {
      const root = document.documentElement
      if (val === 'dark') {
        root.classList.add('dark')
        root.classList.remove('light')
      } else {
        root.classList.remove('dark')
        root.classList.add('light')
      }
      localStorage.setItem('mecnun_theme', val)
    }
  }

  const toggleTheme = () => {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    applyTheme(theme.value)
  }

  return {
    theme,
    isDark: computed(() => theme.value === 'dark'),
    initTheme,
    toggleTheme,
  }
}
