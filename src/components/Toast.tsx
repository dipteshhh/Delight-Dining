import {
  createContext,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'

type ToastTone = 'success' | 'error' | 'info'

interface ToastItem {
  id: string
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  addToast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

const TOAST_ICONS: Record<ToastTone, string> = {
  error: '!',
  info: 'i',
  success: '✓',
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timeoutsRef = useRef<Map<string, number>>(new Map())

  const removeToast = (id: string) => {
    const timeoutId = timeoutsRef.current.get(id)
    if (timeoutId) {
      window.clearTimeout(timeoutId)
      timeoutsRef.current.delete(id)
    }

    setToasts((currentToasts) =>
      currentToasts.filter((toast) => toast.id !== id)
    )
  }

  const value = useMemo<ToastContextValue>(
    () => ({
      addToast: (message, tone = 'info') => {
        const id = crypto.randomUUID()
        setToasts((currentToasts) => [...currentToasts, { id, message, tone }])

        const timeoutId = window.setTimeout(() => removeToast(id), 3600)
        timeoutsRef.current.set(id, timeoutId)
      },
    }),
    []
  )

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="toast-container" aria-live="polite" aria-atomic="true">
        {toasts.map((toast) => (
          <div className={`toast toast-${toast.tone}`} key={toast.id} role="status">
            <span className="toast-icon" aria-hidden="true">
              {TOAST_ICONS[toast.tone]}
            </span>
            <p className="toast-message">{toast.message}</p>
            <button
              aria-label="Dismiss notification"
              className="toast-dismiss"
              onClick={() => removeToast(toast.id)}
              type="button"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = useContext(ToastContext)
  if (!context) throw new Error('useToast must be used within ToastProvider')
  return context
}
