import { Activity } from 'lucide-react'
import { Outlet } from 'react-router-dom'
import { ClientBottomNav } from './ClientBottomNav'
export function ClientLayout() { return <div className="min-h-screen bg-canvas pb-16 md:pb-0"><header className="border-b border-slate-200 bg-white"><div className="mx-auto flex h-16 max-w-md items-center gap-2 px-4"><span className="grid h-8 w-8 place-items-center rounded-md bg-brand text-white"><Activity size={18} /></span><span className="font-bold">OPD Flow</span><span className="ml-auto text-xs text-slate-500">City Care Clinic</span></div></header><main className="mx-auto max-w-md p-4"><Outlet /></main><ClientBottomNav /></div> }
