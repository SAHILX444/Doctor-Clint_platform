export function SectionHeading({ title, description, action }) {
  return <div className="mb-4 flex items-start justify-between gap-4"><div><h2 className="text-lg font-bold text-ink">{title}</h2>{description && <p className="mt-1 text-sm text-slate-500">{description}</p>}</div>{action}</div>
}
