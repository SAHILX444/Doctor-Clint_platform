import { useEffect, useState } from 'react'
import { Card } from '../components/ui/Card'
import { useQueue } from '../context/QueueProvider'
import { activeQueue } from '../lib/queueMath'
export function LiveQueuePage() {
  const { doctors, patients, tick } = useQueue()
  const [clock, setClock] = useState(new Date())
  useEffect(() => {
    const id = setInterval(() => setClock(new Date()), 1000)
    return () => clearInterval(id)
  }, [])
  const mainDoctor = doctors[0]
  const queue = activeQueue(patients, mainDoctor?.id)
  const current = queue.find((p) => p.status === 'in_consultation')
  const next = queue.filter((p) => p.id !== current?.id).slice(0, 3)
  return (
    <main className="min-h-screen bg-canvas p-5 text-ink sm:p-10">
      <div className="mx-auto max-w-[1800px]">
        <header className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-brand">
              City Care Clinic — OPD
            </p>
            <h1 className="mt-3 text-3xl font-bold sm:text-5xl">Live queue</h1>
          </div>
          <time className="text-xl font-semibold sm:text-3xl">
            {clock.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
          </time>
        </header>
        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <Card className="border-l-8 border-l-brand p-6 sm:p-10">
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Now consulting
            </p>
            <p className="mt-4 text-[clamp(3rem,9vw,8rem)] font-black leading-none text-brand">
              {current?.token || '—'}
            </p>
            <p className="mt-4 text-xl font-semibold sm:text-3xl">Room {mainDoctor?.room}</p>
          </Card>
          <div>
            <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
              Next patients
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              {next.map((p) => (
                <div
                  className="rounded-lg border border-slate-200 bg-white p-5 text-center"
                  key={p.id}
                >
                  <p className="text-4xl font-black sm:text-5xl">{p.token}</p>
                  <p className="mt-2 text-sm text-slate-500">
                    {p.priority === 'emergency' ? 'Emergency' : 'Waiting'}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
        <section className="mt-10">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">By doctor</p>
          <div className="mt-4 overflow-hidden rounded-lg border border-slate-200 bg-white">
            {doctors.map((doctor) => {
              const active = activeQueue(patients, doctor.id)
              const serving = active.find((p) => p.status === 'in_consultation')
              return (
                <div
                  className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5 last:border-0 sm:p-6"
                  key={doctor.id}
                >
                  <div>
                    <p className="text-xl font-bold">{doctor.name}</p>
                    <p className="text-sm text-slate-500">
                      {doctor.specialization} · Room {doctor.room}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs uppercase text-slate-500">
                      {doctor.status.replace('_', ' ')}
                    </p>
                    <p className="mt-1 text-2xl font-bold">{serving?.token || '—'}</p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>
        <p className="mt-5 text-right text-sm text-slate-500">
          Updated {Math.max(0, Math.floor((Date.now() - tick) / 1000))}s ago
        </p>
      </div>
    </main>
  )
}
