import { createContext, useContext, useEffect, useMemo, useReducer } from 'react'
import { activeQueue, doctorVelocity, etaMinutes, workload } from '../lib/queueMath'
import { queueService } from '../services/queueService'
import { useTicker } from '../hooks/useTicker'
import { useAuth } from './AuthContext'
import { initialState } from './queueInitialState'
import { reducer } from './queueReducer'

const QueueContext = createContext(null)

export function QueueProvider({ children }) {
  const { user } = useAuth()
  const [state, dispatch] = useReducer(reducer, initialState)
  const tick = useTicker(1000)
  useEffect(() => {
    dispatch({ type: 'TICK', now: tick })
  }, [tick])
  useEffect(() => {
    Promise.all([queueService.getDoctors(), queueService.getPatients()]).then(
      ([doctors, patients]) =>
        dispatch({
          type: 'HYDRATE',
          doctors,
          patients,
          clientId: user?.role === 'client' ? user.id : null,
        })
    )
  }, [user?.id, user?.role])
  const actions = useMemo(
    () => ({
      callNext: (doctorId) => dispatch({ type: 'CALL_NEXT', doctorId }),
      start: (patientId) => dispatch({ type: 'START_CONSULTATION', patientId }),
      complete: (patientId) => dispatch({ type: 'COMPLETE_CONSULTATION', patientId }),
      noShow: (patientId) => dispatch({ type: 'MARK_NO_SHOW', patientId }),
      addEmergency: (payload) => dispatch({ type: 'ADD_EMERGENCY', payload }),
      transfer: (patientId, toDoctorId) =>
        dispatch({ type: 'TRANSFER_PATIENT', patientId, toDoctorId }),
      setDoctorStatus: (doctorId, status) =>
        dispatch({ type: 'SET_DOCTOR_STATUS', doctorId, status }),
      saveSettings: (doctorId, changes) => dispatch({ type: 'SAVE_SETTINGS', doctorId, changes }),
      readNotifications: () => dispatch({ type: 'READ_NOTIFICATIONS' }),
    }),
    []
  )
  const derived = useMemo(
    () => ({
      doctor: user?.role === 'doctor' ? state.doctors.find((d) => d.id === user.id) : null,
      client: user?.role === 'client' ? state.patients.find((p) => p.id === user.id) : null,
      queueFor: (doctorId) => activeQueue(state.patients, doctorId),
      etaFor: (patient) =>
        etaMinutes(
          patient,
          activeQueue(state.patients, patient.doctorId),
          state.doctors.find((d) => d.id === patient.doctorId),
          state.tick
        ),
      velocityFor: (doctorId) =>
        doctorVelocity(
          state.patients,
          state.doctors.find((d) => d.id === doctorId),
          state.tick
        ),
      workloadFor: (doctor) => workload(doctor, state.patients),
    }),
    [state, user]
  )
  return (
    <QueueContext.Provider value={{ ...state, ...derived, ...actions }}>
      {children}
    </QueueContext.Provider>
  )
}
export const useQueue = () => useContext(QueueContext)
