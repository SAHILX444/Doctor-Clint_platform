import { ArrowRightLeft, Check, PhoneCall, Play, UserX } from 'lucide-react'
import { Button } from '../ui/Button'
export function QueueActions({ patient, onCall, onStart, onComplete, onNoShow, onTransfer }) {
  if (patient.status === 'waiting') return <div className="flex flex-wrap gap-2"><Button className="min-h-9 px-3" onClick={onCall}><PhoneCall size={15} /> Call</Button><Button className="min-h-9 px-3" variant="secondary" onClick={onNoShow}><UserX size={15} /> No-show</Button>{onTransfer && <Button className="min-h-9 px-3" variant="secondary" onClick={onTransfer}><ArrowRightLeft size={15} /> Transfer</Button>}</div>
  if (patient.status === 'called') return <div className="flex flex-wrap gap-2"><Button className="min-h-9 px-3" onClick={onStart}><Play size={15} /> Start</Button><Button className="min-h-9 px-3" variant="secondary" onClick={onNoShow}><UserX size={15} /> No-show</Button></div>
  if (patient.status === 'in_consultation') return <Button className="min-h-9 px-3" onClick={onComplete}><Check size={15} /> Complete</Button>
  return <span className="text-xs text-slate-400">No action</span>
}
