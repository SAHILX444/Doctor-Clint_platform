import { useEffect, useState } from 'react'

export function useTicker(interval = 1000) {
  const [tick, setTick] = useState(Date.now())
  useEffect(() => {
    const id = window.setInterval(() => setTick(Date.now()), interval)
    return () => window.clearInterval(id)
  }, [interval])
  return tick
}
