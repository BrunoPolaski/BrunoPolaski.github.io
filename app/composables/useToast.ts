export interface Toast {
  id: number
  title: string
  tone?: 'neutral' | 'good' | 'critical'
}

let seq = 0

export function useToast() {
  const toasts = useState<Toast[]>('toasts', () => [])

  function dismiss(id: number) {
    toasts.value = toasts.value.filter(t => t.id !== id)
  }

  function push(title: string, tone: Toast['tone'] = 'neutral') {
    const id = ++seq
    toasts.value.push({ id, title, tone })
    setTimeout(() => dismiss(id), 4000)
  }

  return { toasts, push, dismiss }
}
