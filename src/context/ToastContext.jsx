import { createContext, useContext, useMemo, useState } from 'react'
import { Toast } from '../components/ui/Toast'

const ToastContext = createContext(null)

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])
  const notify = (toast) => {
    const id = `${Date.now()}-${Math.random()}`
    setToasts((items) => [...items, { id, tone: 'default', ...toast }])
    window.setTimeout(() => setToasts((items) => items.filter((item) => item.id !== id)), 5000)
  }
  const value = useMemo(() => ({ notify }), [])
  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className="fixed bottom-4 right-4 z-50 flex w-[min(360px,calc(100%-2rem))] flex-col gap-2 max-sm:bottom-20 max-sm:left-4 max-sm:right-4"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <Toast key={toast.id} {...toast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}
export const useToast = () => useContext(ToastContext)
