import { RefreshCw } from 'lucide-react'
import { useState } from 'react'
import { Card } from '../../components/ui/Card'
import { ETADisplay } from '../../components/ui/ETADisplay'
import { StatusBadge } from '../../components/ui/StatusBadge'
import { ClientQueueStrip } from '../../components/queue/ClientQueueStrip'
import { useQueue } from '../../context/QueueProvider'
import { relativeTime } from '../../lib/format'
import { queuePosition } from '../../lib/queueMath'
export function MyQueuePage() {
  const { client, doctors, queueFor, etaFor, tick } = useQueue()
  const [refreshed, setRefreshed] = useState(Date.now())
  const doctor = doctors.find((d) => d.id === client?.doctorId)
  const queue = doctor ? queueFor(doctor.id) : []
  const position = client ? queuePosition(client, queue) : null
  if (!client || !doctor) return null
  const doctorStatus =
    {
      available: 'Doctor is available',
      consulting: 'Doctor is currently consulting',
      on_break: 'Doctor is on a break',
      offline: 'Doctor is offline',
    }[doctor.status] || 'Doctor status unavailable'
  return (
    <div className="space-y-4 py-2">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Your queue</p>
        <h1 className="mt-1 text-2xl font-bold">Good morning, {client.name.split(' ')[0]}</h1>
      </div>
      <Card className="p-5">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Your token</p>
        <p className="mt-2 text-4xl font-bold text-brand">{client.token}</p>
        <div className="mt-6 text-center">
          <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Estimated wait</p>
          <p className="mt-1 text-6xl font-bold tracking-tight text-ink">
            <ETADisplay minutes={etaFor(client)} />
          </p>
        </div>
        <div className="mt-6 grid grid-cols-2 gap-3 border-t border-slate-200 pt-4 text-center">
          <div>
            <p className="text-xs uppercase text-slate-500">Your position</p>
            <p className="mt-1 text-2xl font-bold">{position ? `#${position}` : '—'}</p>
          </div>
          <div>
            <p className="text-xs uppercase text-slate-500">Last updated</p>
            <p className="mt-2 text-sm font-semibold">{relativeTime(refreshed, tick)}</p>
          </div>
        </div>
      </Card>
      <Card className="p-5">
        <p className="font-semibold">{doctor.name}</p>
        <p className="text-sm text-slate-500">
          {doctor.specialization} · Room {doctor.room}
        </p>
        <div className="mt-4 space-y-2 text-sm">
          <p className="text-slate-600">{doctorStatus}</p>
          <p className="flex items-center gap-2 text-slate-600">
            <span>Your status:</span>
            <StatusBadge status={client.status} />
          </p>
        </div>
      </Card>
      <ClientQueueStrip queue={queue} client={client} />
      <p className="text-center text-sm text-slate-600">
        What happens next? Stay nearby; we'll notify you when your consultation is ready.
      </p>
      <button
        className="mx-auto flex min-h-11 items-center gap-2 rounded-md px-4 text-sm font-semibold text-brand hover:bg-brand-light"
        onClick={() => setRefreshed(Date.now())}
      >
        <RefreshCw size={16} />
        Refresh queue
      </button>
    </div>
  )
}
