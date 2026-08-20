export interface ConfirmOptions {
  title?: string
  message: string
  confirmText?: string
  cancelText?: string
  type?: 'danger' | 'warning' | 'info'
}

export const useConfirm = () => {
  const isOpen = useState<boolean>('confirm_modal_open', () => false)
  const options = useState<ConfirmOptions>('confirm_modal_options', () => ({
    message: '',
    title: 'Onay Gerekiyor',
    confirmText: 'Onayla',
    cancelText: 'Vazgeç',
    type: 'danger',
  }))

  const resolver = useState<((value: boolean) => void) | null>('confirm_modal_resolver', () => null)

  const ask = (opts: ConfirmOptions): Promise<boolean> => {
    options.value = {
      title: opts.title || 'İşlemi Onaylayın',
      message: opts.message,
      confirmText: opts.confirmText || 'Evet, Devam Et',
      cancelText: opts.cancelText || 'Vazgeç',
      type: opts.type || 'danger',
    }
    isOpen.value = true

    return new Promise((resolve) => {
      resolver.value = resolve
    })
  }

  const confirm = () => {
    isOpen.value = false
    if (resolver.value) {
      resolver.value(true)
      resolver.value = null
    }
  }

  const cancel = () => {
    isOpen.value = false
    if (resolver.value) {
      resolver.value(false)
      resolver.value = null
    }
  }

  return {
    isOpen,
    options,
    ask,
    confirm,
    cancel,
  }
}
