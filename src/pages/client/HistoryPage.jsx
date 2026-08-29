import { Card } from '../../components/ui/Card'
export function HistoryPage() {
  const visits = [
    {
      date: '18 Apr 2025',
      doctor: 'Dr. Sharma',
      token: 'A-083',
      wait: '14 min',
      duration: '10 min',
      status: 'Completed',
    },
    {
      date: '02 Mar 2025',
      doctor: 'Dr. Patil',
      token: 'B-019',
      wait: '22 min',
      duration: '12 min',
      status: 'Completed',
    },
  ]
  return (
    <div className="space-y-4 py-2">
      <h1 className="text-2xl font-bold">History</h1>
      {visits.map((visit) => (
        <Card key={visit.token} className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-bold">{visit.doctor}</p>
              <p className="mt-1 text-sm text-slate-500">
                {visit.date} · {visit.token}
              </p>
            </div>
            <span className="rounded-md border border-emerald-200 bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
              ✓ {visit.status}
            </span>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
            <p>
              <span className="text-slate-500">Wait time</span>
              <br />
              <strong>{visit.wait}</strong>
            </p>
            <p>
              <span className="text-slate-500">Consultation</span>
              <br />
              <strong>{visit.duration}</strong>
            </p>
          </div>
        </Card>
      ))}
    </div>
  )
}
