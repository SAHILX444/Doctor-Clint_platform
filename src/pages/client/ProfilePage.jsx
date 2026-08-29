import { LogOut } from 'lucide-react'
import { useState } from 'react'
import { Button } from '../../components/ui/Button'
import { Card } from '../../components/ui/Card'
import { useAuth } from '../../context/AuthContext'
import { useQueue } from '../../context/QueueProvider'
import { LoadingState } from '../../components/ui/LoadingState'
import { ConfirmationModal } from '../../components/ui/ConfirmationModal'
export function ProfilePage() {
  const { logout } = useAuth()
  const { client, loading } = useQueue()
  const [confirm, setConfirm] = useState(false)
  if (loading || !client) return <LoadingState />
  return (
    <div className="space-y-4 py-2">
      <h1 className="text-2xl font-bold">Profile</h1>
      <Card className="divide-y divide-slate-200 p-5">
        <div className="pb-4">
          <p className="text-xs uppercase text-slate-500">Name</p>
          <p className="mt-1 font-semibold">{client.name}</p>
        </div>
        {[
          ['Patient ID', client.id],
          ['Phone', client.phone],
          ['Age', `${client.age} years`],
          ['Blood group', 'Not provided'],
        ].map(([label, value]) => (
          <div className="py-4" key={label}>
            <p className="text-xs uppercase text-slate-500">{label}</p>
            <p className="mt-1 font-semibold">{value}</p>
          </div>
        ))}
      </Card>
      <Button
        variant="secondary"
        className="flex w-full items-center justify-center gap-2"
        onClick={() => setConfirm(true)}
      >
        <LogOut size={17} />
        Log out
      </Button>
      {confirm && (
        <ConfirmationModal
          title="Log out of OPD Flow?"
          message="You will need to sign in again to view your queue."
          confirmLabel="Log out"
          onConfirm={logout}
          onClose={() => setConfirm(false)}
        />
      )}
    </div>
  )
}
