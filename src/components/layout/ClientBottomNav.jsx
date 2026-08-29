import { Bell, CalendarDays, Clock3, History, UserRound } from 'lucide-react'
import { NavLink } from 'react-router-dom'
const links = [
  ['/client', 'My Queue', Clock3],
  ['/client/appointment', 'Appointment', CalendarDays],
  ['/client/notifications', 'Alerts', Bell],
  ['/client/history', 'History', History],
  ['/client/profile', 'Profile', UserRound],
]
export function ClientBottomNav() {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-20 border-t border-slate-200 bg-white md:static md:border-t-0"
      aria-label="Client navigation"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {links.map(([to, label, Icon]) => (
          <NavLink
            end={to === '/client'}
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] ${isActive ? 'font-bold text-brand' : 'text-slate-500'}`
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
