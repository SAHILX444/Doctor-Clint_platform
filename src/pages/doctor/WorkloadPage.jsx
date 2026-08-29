import { SectionHeading } from '../../components/ui/SectionHeading'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useQueue } from '../../context/QueueProvider'
import { EmergencyForm } from '../../components/forms/EmergencyForm'
import { useState } from 'react'
export function WorkloadPage() {
  const { doctors, workloadFor } = useQueue()
  const [doctor, setDoctor] = useState(null)
  const metrics = doctors.map((d) => ({ d, ...workloadFor(d) }))
  const recommended = [...metrics]
    .filter((m) => m.d.status !== 'offline')
    .sort((a, b) => a.estimatedWaitMin - b.estimatedWaitMin)[0]
  return (
    <div className="space-y-6">
      <SectionHeading
        title="Workload"
        description="Balance queues using current demand and consultation pace."
      />
      {recommended && (
        <Card className="border-brand/20 bg-brand-light p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-brand-dark">
            Recommended doctor
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-lg font-bold">
              {recommended.d.name} has the lowest estimated waiting time.
            </p>
            <Button onClick={() => setDoctor(recommended.d.id)}>Assign new patient</Button>
          </div>
        </Card>
      )}
      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-slate-500">
            <tr>
              {[
                'Doctor',
                'Specialization',
                'Queue size',
                'Avg consultation',
                'Estimated workload',
                'Status',
                'Estimated wait',
              ].map((h) => (
                <th className="px-4 py-3" key={h}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {metrics.map(
              ({ d, queueSize, avgConsultMin, estimatedWorkloadMin, estimatedWaitMin }) => (
                <tr key={d.id}>
                  <td className="px-4 py-4 font-semibold">{d.name}</td>
                  <td className="px-4 py-4 text-slate-600">{d.specialization}</td>
                  <td className="px-4 py-4">{queueSize}</td>
                  <td className="px-4 py-4">{avgConsultMin.toFixed(1)} min</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-2 w-28 rounded bg-slate-100">
                        <div
                          className="h-2 rounded bg-brand"
                          style={{ width: `${Math.min(100, estimatedWorkloadMin / 2)}%` }}
                        />
                      </div>
                      {estimatedWorkloadMin} min
                    </div>
                  </td>
                  <td className="px-4 py-4 capitalize text-slate-600">
                    {d.status.replace('_', ' ')}
                  </td>
                  <td className="px-4 py-4 font-semibold">{estimatedWaitMin} min</td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
      {doctor && <EmergencyForm preselectedDoctor={doctor} onClose={() => setDoctor(null)} />}
    </div>
  )
}
