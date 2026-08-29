export function ETADisplay({ minutes }) {
  return (
    <span className="font-semibold text-ink">
      {minutes === null || minutes === undefined ? '—' : `${minutes} min`}
    </span>
  )
}
