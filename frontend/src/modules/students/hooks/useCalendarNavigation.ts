import { useCallback } from 'react'
import { monthNames } from '../StudentProfileData'

export function useCalendarNavigation() {
  const getWeekStart = useCallback((d: Date) => {
    const r = new Date(d)
    const day = r.getDay()
    r.setDate(r.getDate() - (day === 0 ? 6 : day - 1))
    return r
  }, [])

  const getWeekEnd = useCallback((d: Date) => {
    const r = new Date(getWeekStart(d))
    r.setDate(r.getDate() + 6)
    return r
  }, [getWeekStart])

  const formatWeekRange = useCallback((d: Date) => {
    const start = getWeekStart(d)
    const end = getWeekEnd(d)
    return `${start.getDate()} ${monthNames[start.getMonth()].slice(0,3)} — ${end.getDate()} ${monthNames[end.getMonth()].slice(0,3)} ${start.getFullYear()}`
  }, [getWeekStart, getWeekEnd])

  const prevPeriod = useCallback((vistaCalendario: 'semana' | 'mes' | 'año', currentDate: Date) => {
    const r = new Date(currentDate)
    if (vistaCalendario === 'semana') r.setDate(r.getDate() - 7)
    else if (vistaCalendario === 'año') r.setFullYear(r.getFullYear() - 1)
    else r.setMonth(r.getMonth() - 1)
    return r
  }, [])

  const nextPeriod = useCallback((vistaCalendario: 'semana' | 'mes' | 'año', currentDate: Date) => {
    const r = new Date(currentDate)
    if (vistaCalendario === 'semana') r.setDate(r.getDate() + 7)
    else if (vistaCalendario === 'año') r.setFullYear(r.getFullYear() + 1)
    else r.setMonth(r.getMonth() + 1)
    return r
  }, [])

  return { getWeekStart, getWeekEnd, formatWeekRange, prevPeriod, nextPeriod }
}