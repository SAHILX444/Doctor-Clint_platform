import { doctors, patients } from '../data/mockData'

const delay = (value) =>
  new Promise((resolve) => window.setTimeout(() => resolve(structuredClone(value)), 400))

// Supabase swap surface: replace these reads with doctors/patients tables and
// subscribe with a realtime channel per doctor. Mutations map to appointments,
// queue, consultations, queue_events, and notifications tables.
export const queueService = {
  getDoctors: () => delay(doctors),
  getPatients: () => delay(patients),
  subscribe: () => () => {},
}
