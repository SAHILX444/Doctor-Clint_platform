import { CheckCircle2, Info, Siren } from 'lucide-react'
export function Toast({ title, message, tone }) {
  const Icon = tone === 'danger' ? Siren : tone === 'success' ? CheckCircle2 : Info
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm">
      <div className="flex gap-2">
        <Icon className="mt-0.5 shrink-0 text-brand" size={18} aria-hidden="true" />
        <div>
          <p className="text-sm font-bold text-ink">{title}</p>
          <p className="mt-1 text-xs text-slate-600">{message}</p>
        </div>
      </div>
    </div>
  )
}
