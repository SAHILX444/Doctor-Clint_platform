export const priorityRank = { emergency: 0, senior: 1, normal: 2 }

export function activeQueue(patients, doctorId) {
  return patients.filter((p) => p.doctorId === doctorId && ['waiting', 'called', 'in_consultation'].includes(p.status))
    .sort((a, b) => (priorityRank[a.priority] - priorityRank[b.priority]) || (new Date(a.arrivedAt) - new Date(b.arrivedAt)))
}

export function queuePosition(patient, queue) {
  const index = queue.findIndex((item) => item.id === patient.id)
  return index < 0 ? null : index + 1
}

export function etaMinutes(patient, queue, doctor, nowMs = Date.now()) {
  const position = queuePosition(patient, queue)
  if (!position) return 0
  const current = queue.find((item) => item.status === 'in_consultation')
  const elapsed = current?.startedAt ? Math.max(0, (nowMs - new Date(current.startedAt).getTime()) / 1000) : 0
  const remainingCurrent = current ? Math.max(0, doctor.avgConsultMin * 60 - elapsed) : 0
  return Math.max(0, Math.round((remainingCurrent + queue.slice(0, position - 1).filter((item) => item.id !== current?.id).length * doctor.avgConsultMin * 60) / 60))
}

export function doctorVelocity(patients, doctor, nowMs = Date.now()) {
  const completed = patients.filter((p) => p.doctorId === doctor.id && p.status === 'completed' && p.durationSec)
  const avgConsultMin = completed.length ? completed.reduce((sum, p) => sum + p.durationSec, 0) / completed.length / 60 : doctor.avgConsultMin
  const current = patients.find((p) => p.doctorId === doctor.id && p.status === 'in_consultation')
  const currentDurationSec = current?.startedAt ? Math.max(0, Math.floor((nowMs - new Date(current.startedAt).getTime()) / 1000)) : 0
  const delay = Math.round((avgConsultMin - 10) * activeQueue(patients, doctor.id).length)
  return { avgConsultMin, currentDurationSec, queueDelayMin: delay }
}

export function workload(doctor, patients) {
  const queue = activeQueue(patients, doctor.id)
  const completed = patients.filter((p) => p.doctorId === doctor.id && p.status === 'completed' && p.durationSec)
  const avgConsultMin = completed.length ? completed.reduce((sum, p) => sum + p.durationSec, 0) / completed.length / 60 : doctor.avgConsultMin
  const current = queue.find((p) => p.status === 'in_consultation')
  const estimatedWorkloadMin = Math.round(queue.length * avgConsultMin)
  const estimatedWaitMin = Math.max(0, Math.round((queue.length - (current ? 1 : 0)) * avgConsultMin))
  return { queueSize: queue.length, avgConsultMin, estimatedWorkloadMin, estimatedWaitMin }
}

export function recommendDoctor(doctors, patients) {
  return doctors.filter((doctor) => doctor.status !== 'offline').map((doctor) => ({ doctor, ...workload(doctor, patients) })).sort((a, b) => a.estimatedWaitMin - b.estimatedWaitMin)[0]?.doctor
}
