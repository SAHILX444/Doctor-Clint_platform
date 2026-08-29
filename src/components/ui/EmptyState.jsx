export function EmptyState({ title, message = 'There is nothing to show here yet.' }) {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 p-8 text-center">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{message}</p>
    </div>
  )
}
