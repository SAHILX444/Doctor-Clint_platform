import { Siren, X } from 'lucide-react'
export function EmergencyAlert({ onDismiss }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-rose-200 bg-rose-50 p-4 text-rose-800">
      <Siren className="mt-0.5 shrink-0" size={20} />
      <div className="flex-1">
        <p className="font-semibold">Emergency patient in active queue</p>
        <p className="mt-1 text-sm">Prioritized cases may change estimated waiting times.</p>
      </div>
      <button
        aria-label="Dismiss emergency alert"
        className="rounded p-1 hover:bg-rose-100"
        onClick={onDismiss}
      >
        <X size={18} />
      </button>
    </div>
  )
}
