import { Siren, Star } from 'lucide-react'
export function PriorityTag({ priority }) {
  if (priority === 'normal') return <span className="text-sm text-slate-500">Normal</span>
  const emergency = priority === 'emergency'
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${emergency ? 'text-rose-700' : 'text-amber-700'}`}
    >
      <>{emergency ? <Siren size={14} /> : <Star size={14} />}</>
      {emergency ? 'Emergency' : 'Senior'}
    </span>
  )
}
