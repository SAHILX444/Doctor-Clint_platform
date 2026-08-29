import { Button } from '../ui/Button'
import { Select } from '../ui/Select'
import { useQueue } from '../../context/QueueProvider'
import { ConfirmationModal } from '../ui/ConfirmationModal'
import { useState } from 'react'
export function TransferForm({ patient, onClose }) {
  const { doctors, workloadFor, transfer } = useQueue()
  const [pending, setPending] = useState(null)
  const choices = doctors.filter((d) => d.id !== patient.doctorId)
  return (
    <div className="fixed inset-0 z-40 grid place-items-center bg-slate-900/30 p-4">
      <form
        className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        onSubmit={(e) => {
          e.preventDefault()
          setPending(e.target.doctor.value)
        }}
      >
        <h2 className="text-lg font-bold">Transfer {patient.token}</h2>
        <p className="mt-1 text-sm text-slate-500">Move this patient to another doctor's queue.</p>
        <div className="mt-5">
          <Select id="transfer-doctor" name="doctor" label="Doctor" defaultValue={choices[0]?.id}>
            {choices.map((doctor) => (
              <option key={doctor.id} value={doctor.id}>
                {doctor.name} — {workloadFor(doctor).estimatedWaitMin} min estimated wait
              </option>
            ))}
          </Select>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit">Review transfer</Button>
        </div>
      </form>
      {pending && (
        <ConfirmationModal
          title="Transfer this patient?"
          message={`Move ${patient.token} to ${doctors.find((d) => d.id === pending)?.name}'s queue?`}
          confirmLabel="Transfer patient"
          onConfirm={() => {
            transfer(patient.id, pending)
            onClose()
          }}
          onClose={() => setPending(null)}
        />
      )}
    </div>
  )
}
