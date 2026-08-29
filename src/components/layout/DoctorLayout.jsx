import { useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { Navbar } from './Navbar'
import { Sidebar } from './Sidebar'
export function DoctorLayout() { const [open, setOpen] = useState(false); const location = useLocation(); const title = location.pathname.split('/')[2] || 'Dashboard'; return <div className="flex min-h-screen bg-canvas"><Sidebar />{open && <div className="fixed inset-0 z-30 bg-slate-900/20 lg:hidden" onClick={() => setOpen(false)}><div className="h-full w-64 bg-white" onClick={(e) => e.stopPropagation()}><Sidebar mobile /></div></div>}<div className="min-w-0 flex-1"><Navbar title={title[0].toUpperCase() + title.slice(1)} onMenu={() => setOpen(true)} /><main className="mx-auto max-w-[1500px] p-4 sm:p-6"><Outlet /></main></div></div> }
