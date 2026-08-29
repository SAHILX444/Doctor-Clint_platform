import { Card } from '../ui/Card'
export function VelocityPanel({ velocity }) {
  const delay = velocity.queueDelayMin > 0 ? `+${velocity.queueDelayMin} min` : 'On time'
  return (
    <Card className="p-5">
      <h2 className="font-bold">Queue velocity</h2>
      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div>
          <p className="text-2xl font-bold">{velocity.avgConsultMin.toFixed(1)} min</p>
          <p className="text-xs text-slate-500">Average per patient</p>
        </div>
        <div>
          <p className="text-2xl font-bold">
            {Math.floor(velocity.currentDurationSec / 60)}:
            {String(velocity.currentDurationSec % 60).padStart(2, '0')}
          </p>
          <p className="text-xs text-slate-500">Current consultation duration</p>
        </div>
        <div>
          <p className="text-2xl font-bold">{delay}</p>
          <p className="text-xs text-slate-500">Queue delay against a 10-minute schedule</p>
        </div>
      </div>
    </Card>
  )
}
