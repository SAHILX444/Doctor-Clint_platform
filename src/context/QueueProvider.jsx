import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { currentClientId, doctors as seedDoctors, initialNotifications, patients as seedPatients } from '../data/mockData'
import { activeQueue, doctorVelocity, etaMinutes, workload } from '../lib/queueMath'
import { queueService } from '../services/queueService'
import { useTicker } from '../hooks/useTicker'

const QueueContext = createContext(null)
const event = (type, message, meta = {}) => ({ id: `${Date.now()}-${Math.random()}`, type, message, meta, at: new Date().toISOString() })

function reducer(state, action) {
  const now = new Date().toISOString()
  const clientEta = (snapshot) => {
    const patient = snapshot.patients.find((p) => p.id === currentClientId)
    const doctor = snapshot.doctors.find((d) => d.id === patient?.doctorId)
    return patient && doctor ? etaMinutes(patient, activeQueue(snapshot.patients, patient.doctorId), doctor, Date.now()) : null
  }
  const clientPosition = (snapshot) => {
    const patient = snapshot.patients.find((p) => p.id === currentClientId)
    return patient ? activeQueue(snapshot.patients, patient.doctorId).findIndex((item) => item.id === patient.id) + 1 : null
  }
  const append = (next, item) => {
    const previousEta = clientEta(state)
    const nextEta = clientEta(next)
    const previousPosition = clientPosition(state)
    const nextPosition = clientPosition(next)
    const notices = []
    if (previousEta !== null && nextEta !== null && previousEta !== nextEta) notices.push({ id: `n-${Date.now()}-eta`, type: 'eta', message: `Your estimated waiting time changed: ${previousEta} min → ${nextEta} min`, at: now, unread: true })
    if (previousPosition !== null && nextPosition !== null && previousPosition !== nextPosition) notices.push({ id: `n-${Date.now()}-position`, type: 'position', message: `Your queue position changed: #${previousPosition} → #${nextPosition}`, at: now, unread: true })
    if (nextPosition !== null && nextPosition <= 1 && previousPosition > 1) notices.push({ id: `n-${Date.now()}-turn`, type: 'starting', message: "It's almost your turn. Please stay nearby.", at: now, unread: true })
    const notifications = [...notices, ...next.notifications]
    return { ...next, notifications, events: [event(action.type, item, action), ...next.events].slice(0, 30) }
  }
  const update = (patientId, changes) => state.patients.map((p) => p.id === patientId ? { ...p, ...changes } : p)
  switch (action.type) {
    case 'HYDRATE': return { ...state, patients: action.patients, doctors: action.doctors, loading: false }
    case 'TICK': return { ...state, tick: action.now }
    case 'CALL_NEXT': {
      const target = activeQueue(state.patients, action.doctorId).find((p) => p.status === 'waiting')
      if (!target) return state
      return append({ ...state, patients: update(target.id, { status: 'called', calledAt: now }) }, `Patient ${target.token} called`)
    }
    case 'START_CONSULTATION': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      if (state.patients.some((p) => p.doctorId === patient?.doctorId && p.status === 'in_consultation')) return state
      return append({ ...state, patients: update(action.patientId, { status: 'in_consultation', startedAt: now }), doctors: state.doctors.map((d) => d.id === patient?.doctorId ? { ...d, status: 'consulting' } : d) }, `${patient?.token} consultation started`)
    }
    case 'COMPLETE_CONSULTATION': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      const durationSec = patient?.startedAt ? Math.floor((Date.now() - new Date(patient.startedAt).getTime()) / 1000) : 0
      const nextDoctors = state.doctors.map((d) => d.id === patient?.doctorId ? { ...d, status: 'available' } : d)
      return append({ ...state, patients: update(action.patientId, { status: 'completed', completedAt: now, durationSec }), doctors: nextDoctors }, `${patient?.token} completed`)
    }
    case 'MARK_NO_SHOW': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      return append({ ...state, patients: update(action.patientId, { status: 'no_show' }) }, `${patient?.token} marked as no-show`)
    }
    case 'ADD_EMERGENCY': {
      const doctorPatients = state.patients.filter((p) => p.doctorId === action.payload.doctorId)
      const latestToken = Math.max(109, ...doctorPatients.map((p) => Number(p.token.split('-')[1]) || 0))
      const item = { ...action.payload, id: `P-${Date.now()}`, token: `A-${latestToken + 1}`, priority: 'emergency', status: 'waiting', arrivedAt: now }
      return append({ ...state, patients: [item, ...state.patients], notifications: [{ id: `n-${Date.now()}`, type: 'emergency', message: 'An emergency case was added. Your estimated wait may change.', at: now, unread: true }, ...state.notifications] }, `Emergency ${item.token} added — queue ETAs recalculated`)
    }
    case 'TRANSFER_PATIENT': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      return append({ ...state, patients: update(action.patientId, { doctorId: action.toDoctorId }) }, `${patient?.token} transferred`)
    }
    case 'SET_DOCTOR_STATUS': return { ...state, doctors: state.doctors.map((d) => d.id === action.doctorId ? { ...d, status: action.status } : d) }
    case 'SAVE_SETTINGS': return { ...state, doctors: state.doctors.map((d) => d.id === action.doctorId ? { ...d, ...action.changes } : d) }
    case 'READ_NOTIFICATIONS': return { ...state, notifications: state.notifications.map((n) => ({ ...n, unread: false })) }
    default: return state
  }
}

const initialState = { doctors: seedDoctors, patients: seedPatients, notifications: initialNotifications, events: [], loading: true, tick: Date.now() }

export function QueueProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState)
  const tick = useTicker(1000)
  useEffect(() => { dispatch({ type: 'TICK', now: tick }) }, [tick])
  useEffect(() => { Promise.all([queueService.getDoctors(), queueService.getPatients()]).then(([doctors, patients]) => dispatch({ type: 'HYDRATE', doctors, patients })) }, [])
  const actions = useMemo(() => ({
    callNext: (doctorId) => dispatch({ type: 'CALL_NEXT', doctorId }),
    start: (patientId) => dispatch({ type: 'START_CONSULTATION', patientId }),
    complete: (patientId) => dispatch({ type: 'COMPLETE_CONSULTATION', patientId }),
    noShow: (patientId) => dispatch({ type: 'MARK_NO_SHOW', patientId }),
    addEmergency: (payload) => dispatch({ type: 'ADD_EMERGENCY', payload }),
    transfer: (patientId, toDoctorId) => dispatch({ type: 'TRANSFER_PATIENT', patientId, toDoctorId }),
    setDoctorStatus: (doctorId, status) => dispatch({ type: 'SET_DOCTOR_STATUS', doctorId, status }),
    saveSettings: (doctorId, changes) => dispatch({ type: 'SAVE_SETTINGS', doctorId, changes }),
    readNotifications: () => dispatch({ type: 'READ_NOTIFICATIONS' })
  }), [])
  const derived = useMemo(() => ({
    doctor: state.doctors.find((d) => d.id === 'd1'),
    client: state.patients.find((p) => p.id === currentClientId),
    queueFor: (doctorId) => activeQueue(state.patients, doctorId),
    etaFor: (patient) => etaMinutes(patient, activeQueue(state.patients, patient.doctorId), state.doctors.find((d) => d.id === patient.doctorId), state.tick),
    velocityFor: (doctorId) => doctorVelocity(state.patients, state.doctors.find((d) => d.id === doctorId), state.tick),
    workloadFor: (doctor) => workload(doctor, state.patients)
  }), [state])
  return <QueueContext.Provider value={{ ...state, ...derived, ...actions }}>{children}</QueueContext.Provider>
}
export const useQueue = () => useContext(QueueContext)
