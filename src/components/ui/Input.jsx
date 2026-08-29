export function Input({ label, id, error, ...props }) {
  return (
    <label className="block text-sm font-medium text-ink" htmlFor={id}>
      {label}
      <input
        id={id}
        className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-ink placeholder:text-slate-400 focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        {...props}
      />
      {error && <span className="mt-1 block text-xs font-medium text-rose-700">{error}</span>}
    </label>
  )
}
