import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function uid(prefix = '') {
  return prefix + Math.random().toString(36).slice(2, 8) + Date.now().toString(36).slice(-4)
}

export const wait = (ms: number) => new Promise((r) => setTimeout(r, ms))
