import { useEffect, useState } from 'react'

/** Read a JSON value from localStorage, falling back safely when storage is unavailable. */
export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage full or blocked: prototype keeps working in memory */
  }
}

export function useLocalStorage<T>(key: string, initial: T | (() => T)) {
  const [value, setValue] = useState<T>(() =>
    readStorage(key, typeof initial === 'function' ? (initial as () => T)() : initial),
  )
  useEffect(() => writeStorage(key, value), [key, value])
  return [value, setValue] as const
}
