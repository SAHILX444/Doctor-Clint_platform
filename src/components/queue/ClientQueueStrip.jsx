export function ClientQueueStrip({ queue, client }) {
  return (
    <div className="space-y-2" aria-label="Queue order">
      {queue.slice(0, 5).map((patient) => {
        const isClient = patient.id === client.id
        const status =
          patient.status === 'in_consultation'
            ? 'Currently consulting'
            : isClient
              ? 'You'
              : 'Waiting'
        return (
          <div
            key={patient.id}
            className={`flex min-h-12 items-center justify-between rounded-md border px-4 py-3 ${isClient ? 'border-brand bg-brand-light' : 'border-slate-200 bg-white'}`}
          >
            <p className="font-bold">{patient.token}</p>
            <p className={`text-sm ${isClient ? 'font-bold text-brand-dark' : 'text-slate-500'}`}>
              {status}
            </p>
          </div>
        )
      })}
    </div>
  )
}
