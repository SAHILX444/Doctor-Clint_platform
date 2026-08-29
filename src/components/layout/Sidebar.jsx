import {
  Activity,
  BarChart3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Settings,
  Siren,
  Users,
  UsersRound,
} from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { useState } from 'react'
import { ConfirmationModal } from '../ui/ConfirmationModal'
const links = [
  ['/doctor', 'Dashboard', LayoutDashboard],
  ['/doctor/queue', 'My Queue', ClipboardList],
  ['/doctor/patients', 'Patients', Users],
  ['/doctor/emergency', 'Emergency', Siren],
  ['/doctor/workload', 'Workload', UsersRound],
  ['/doctor/analytics', 'Analytics', BarChart3],
  ['/doctor/settings', 'Settings', Settings],
]
export function Sidebar({ mobile = false }) {
  const { logout } = useAuth()
  const [confirm, setConfirm] = useState(false)
  return (
    <>
      <aside
        className={`${mobile ? 'flex' : 'hidden lg:flex'} w-64 shrink-0 flex-col border-r border-slate-200 bg-white`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-slate-200 px-6">
          <span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-white">
            <Activity size={18} />
          </span>
          <span className="font-bold text-ink">OPD Flow</span>
        </div>
        <nav className="flex-1 space-y-1 p-4" aria-label="Doctor navigation">
          {links.map(([to, label, Icon]) => (
            <NavLink
              end={to === '/doctor'}
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium ${isActive ? 'bg-brand-light text-brand-dark' : 'text-slate-600 hover:bg-slate-50'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => setConfirm(true)}
          className="m-4 flex min-h-10 items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
        >
          <LogOut size={18} />
          Log out
        </button>
      </aside>
      {confirm && (
        <ConfirmationModal
          title="Log out of OPD Flow?"
          message="You will need to sign in again to access the doctor console."
          confirmLabel="Log out"
          onConfirm={logout}
          onClose={() => setConfirm(false)}
        />
      )}
    </>
  )
}
