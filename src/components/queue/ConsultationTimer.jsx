import { formatDuration } from '../../lib/format'
import { useQueue } from '../../context/QueueProvider'
export function ConsultationTimer({ startedAt }) {
  const { tick } = useQueue()
  const seconds = startedAt
    ? Math.max(0, Math.floor((tick - new Date(startedAt).getTime()) / 1000))
    : 0
  return (
    <span role="timer" aria-live="off" className="font-mono text-3xl font-bold text-ink">
      {formatDuration(seconds)}
    </span>
  )
}
