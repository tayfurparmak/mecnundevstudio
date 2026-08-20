export type ToastType = 'success' | 'error' | 'info' | 'warning'

export interface ToastItem {
  id: string
  title?: string
  message: string
  type: ToastType
  duration?: number
}

export const useToast = () => {
  const toasts = useState<ToastItem[]>('global_toasts', () => [])

  const removeToast = (id: string) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
    const duration = toast.duration ?? 4000

    const newToast: ToastItem = {
      id,
      ...toast,
    }

    toasts.value.push(newToast)

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }

  const success = (message: string, title?: string) => addToast({ message, title, type: 'success' })
  const error = (message: string, title?: string) => addToast({ message, title, type: 'error', duration: 5000 })
  const info = (message: string, title?: string) => addToast({ message, title, type: 'info' })
  const warning = (message: string, title?: string) => addToast({ message, title, type: 'warning' })

  return {
    toasts,
    addToast,
    removeToast,
    success,
    error,
    info,
    warning,
  }
}
