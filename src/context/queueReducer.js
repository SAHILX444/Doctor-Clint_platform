import { activeQueue, etaMinutes, queuePosition } from '../lib/queueMath'

const event = (type, message, meta = {}) => ({
  id: `${Date.now()}-${Math.random()}`,
  type,
  message,
  meta,
  at: new Date().toISOString(),
})

export function reducer(state, action) {
  const now = new Date().toISOString()
  const clientEta = (snapshot) => {
    const patient = snapshot.patients.find((p) => p.id === snapshot.clientId)
    const doctor = snapshot.doctors.find((d) => d.id === patient?.doctorId)
    return patient && doctor
      ? etaMinutes(patient, activeQueue(snapshot.patients, patient.doctorId), doctor, Date.now())
      : null
  }
  const clientPosition = (snapshot) => {
    const patient = snapshot.patients.find((p) => p.id === snapshot.clientId)
    return patient ? queuePosition(patient, activeQueue(snapshot.patients, patient.doctorId)) : null
  }
  const append = (next, item) => {
    const previousEta = clientEta(state)
    const nextEta = clientEta(next)
    const previousPosition = clientPosition(state)
    const nextPosition = clientPosition(next)
    const notices = []
    if (previousEta !== null && nextEta !== null && previousEta !== nextEta)
      notices.push({
        id: `n-${Date.now()}-eta`,
        type: 'eta',
        message: `Your estimated waiting time changed: ${previousEta} min → ${nextEta} min`,
        at: now,
        unread: true,
      })
    if (previousPosition !== null && nextPosition !== null && previousPosition !== nextPosition)
      notices.push({
        id: `n-${Date.now()}-position`,
        type: 'position',
        message: `Your queue position changed: #${previousPosition} → #${nextPosition}`,
        at: now,
        unread: true,
      })
    if (nextPosition !== null && nextPosition <= 1 && previousPosition > 1)
      notices.push({
        id: `n-${Date.now()}-turn`,
        type: 'starting',
        message: "It's almost your turn. Please stay nearby.",
        at: now,
        unread: true,
      })
    const notifications = [...notices, ...next.notifications]
    return {
      ...next,
      notifications,
      events: [event(action.type, item, action), ...next.events].slice(0, 30),
    }
  }
  const update = (patientId, changes) =>
    state.patients.map((p) => (p.id === patientId ? { ...p, ...changes } : p))
  switch (action.type) {
    case 'HYDRATE':
      return {
        ...state,
        patients: action.patients,
        doctors: action.doctors,
        clientId: action.clientId,
        loading: false,
      }
    case 'TICK':
      return { ...state, tick: action.now }
    case 'CALL_NEXT': {
      const target = activeQueue(state.patients, action.doctorId).find(
        (p) => p.status === 'waiting'
      )
      if (!target) return state
      return append(
        { ...state, patients: update(target.id, { status: 'called', calledAt: now }) },
        `Patient ${target.token} called`
      )
    }
    case 'START_CONSULTATION': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      if (
        state.patients.some(
          (p) => p.doctorId === patient?.doctorId && p.status === 'in_consultation'
        )
      )
        return state
      return append(
        {
          ...state,
          patients: update(action.patientId, { status: 'in_consultation', startedAt: now }),
          doctors: state.doctors.map((d) =>
            d.id === patient?.doctorId ? { ...d, status: 'consulting' } : d
          ),
        },
        `${patient?.token} consultation started`
      )
    }
    case 'COMPLETE_CONSULTATION': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      const durationSec = patient?.startedAt
        ? Math.floor((Date.now() - new Date(patient.startedAt).getTime()) / 1000)
        : 0
      const nextDoctors = state.doctors.map((d) =>
        d.id === patient?.doctorId ? { ...d, status: 'available' } : d
      )
      return append(
        {
          ...state,
          patients: update(action.patientId, {
            status: 'completed',
            completedAt: now,
            durationSec,
          }),
          doctors: nextDoctors,
        },
        `${patient?.token} completed`
      )
    }
    case 'MARK_NO_SHOW': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      return append(
        { ...state, patients: update(action.patientId, { status: 'no_show' }) },
        `${patient?.token} marked as no-show`
      )
    }
    case 'ADD_EMERGENCY': {
      const doctorPatients = state.patients.filter((p) => p.doctorId === action.payload.doctorId)
      const latestToken = Math.max(
        109,
        ...doctorPatients.map((p) => Number(p.token.split('-')[1]) || 0)
      )
      const item = {
        ...action.payload,
        id: `P-${Date.now()}`,
        token: `A-${latestToken + 1}`,
        priority: 'emergency',
        status: 'waiting',
        arrivedAt: now,
      }
      return append(
        {
          ...state,
          patients: [item, ...state.patients],
          notifications: [
            {
              id: `n-${Date.now()}`,
              type: 'emergency',
              message: 'An emergency case was added. Your estimated wait may change.',
              at: now,
              unread: true,
            },
            ...state.notifications,
          ],
        },
        `Emergency ${item.token} added — queue ETAs recalculated`
      )
    }
    case 'TRANSFER_PATIENT': {
      const patient = state.patients.find((p) => p.id === action.patientId)
      return append(
        { ...state, patients: update(action.patientId, { doctorId: action.toDoctorId }) },
        `${patient?.token} transferred`
      )
    }
    case 'SET_DOCTOR_STATUS':
      return {
        ...state,
        doctors: state.doctors.map((d) =>
          d.id === action.doctorId ? { ...d, status: action.status } : d
        ),
      }
    case 'SAVE_SETTINGS':
      return {
        ...state,
        doctors: state.doctors.map((d) =>
          d.id === action.doctorId ? { ...d, ...action.changes } : d
        ),
      }
    case 'READ_NOTIFICATIONS':
      return { ...state, notifications: state.notifications.map((n) => ({ ...n, unread: false })) }
    default:
      return state
  }
}
