export function Select({ label, id, children, ...props }) {
  return (
    <label className="block text-sm font-medium text-ink" htmlFor={id}>
      {label}
      <select
        id={id}
        className="mt-1 min-h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/20"
        {...props}
      >
        {children}
      </select>
    </label>
  )
}
