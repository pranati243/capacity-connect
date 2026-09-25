import { useEffect, useState } from 'react'

// Bump the version whenever the seed shape changes so stale browser data is discarded.
export const STORAGE_PREFIX = 'capacity-connect:v2:'

export function usePersisted<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_PREFIX + key)
      return raw ? (JSON.parse(raw) as T) : initial
    } catch {
      return initial
    }
  })
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value))
    } catch {
      // storage unavailable (private mode); state still works in memory
    }
  }, [key, value])
  return [value, setValue] as const
}

export function resetDemoData() {
  try {
    Object.keys(localStorage)
      .filter((k) => k.startsWith('capacity-connect:'))
      .forEach((k) => localStorage.removeItem(k))
  } catch {
    // ignore
  }
  window.location.href = '/'
}
