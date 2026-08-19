import { useState, useCallback } from 'react'
import type { SavedRoutine } from '../components/RoutineCreator'

const STORAGE_KEY = 'unifit-student-routines'

export function useRoutine() {
  const [routines, setRoutines] = useState<SavedRoutine[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      const parsed = stored ? JSON.parse(stored) : []
      return Array.isArray(parsed) ? parsed : []
    } catch {
      return []
    }
  })

  const persist = useCallback((next: SavedRoutine[]) => {
    setRoutines(next)
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    } catch {
    }
  }, [])

  const addRoutine = useCallback((routine: SaveRoutineInput): SavedRoutine => {
    const newRoutine: SavedRoutine = {
      ...routine,
      id: `routine-${Date.now()}`,
    }
    persist([newRoutine, ...routines])
    return newRoutine
  }, [routines, persist])

  const updateRoutine = useCallback((routine: SavedRoutine) => {
    persist(routines.map(r => (r.id === routine.id ? routine : r)))
  }, [routines, persist])

  const removeRoutine = useCallback((id: string) => {
    persist(routines.filter(r => r.id !== id))
  }, [routines, persist])

  const getRoutineById = useCallback((id: string) => routines.find(r => r.id === id), [routines])

  return { routines, addRoutine, updateRoutine, removeRoutine, getRoutineById }
}

export interface SaveRoutineInput {
  id?: string
  name: string
  description: string
  level: string
  weeks: SavedRoutine['weeks']
}
