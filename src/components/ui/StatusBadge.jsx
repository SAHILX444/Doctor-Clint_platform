import { CheckCircle2, Clock3, MinusCircle, PhoneCall, Stethoscope, Siren } from 'lucide-react'
const map = {
  waiting: ['Waiting', Clock3, 'border-amber-200 bg-amber-50 text-amber-700'],
  called: ['Called', PhoneCall, 'border-brand/20 bg-brand-light text-brand-dark'],
  in_consultation: [
    'In consultation',
    Stethoscope,
    'border-brand/20 bg-brand-light text-brand-dark',
  ],
  completed: ['Completed', CheckCircle2, 'border-emerald-200 bg-emerald-50 text-emerald-700'],
  no_show: ['No-show', MinusCircle, 'border-slate-200 bg-slate-100 text-slate-600'],
  emergency: ['Emergency', Siren, 'border-rose-200 bg-rose-50 text-rose-700'],
}
export function StatusBadge({ status }) {
  const [label, Icon, style] = map[status] || map.waiting
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs font-semibold ${style}`}
    >
      <Icon size={14} aria-hidden="true" />
      {label}
    </span>
  )
}
