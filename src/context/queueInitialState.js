import {
  doctors as seedDoctors,
  initialNotifications,
  patients as seedPatients,
} from '../data/mockData'

export const initialState = {
  doctors: seedDoctors,
  patients: seedPatients,
  notifications: initialNotifications,
  events: [],
  loading: true,
  clientId: null,
  tick: Date.now(),
}
