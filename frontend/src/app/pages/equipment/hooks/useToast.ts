import { useState, useEffect } from 'react'

export function useToast(duration = 4500) {
  const [show, setShow] = useState(false)
  const [name, setName] = useState('')
  const [progress, setProgress] = useState(100)

  useEffect(() => {
    if (!show) return
    setProgress(100)
    const start = Date.now()
    const interval = setInterval(() => {
      const elapsed = Date.now() - start
      const remaining = Math.max(0, 100 - (elapsed / duration) * 100)
      setProgress(remaining)
      if (remaining <= 0) clearInterval(interval)
    }, 30)
    return () => clearInterval(interval)
  }, [show, duration])

  function trigger(toastName: string) {
    setName(toastName)
    setShow(true)
    setTimeout(() => setShow(false), duration)
  }

  return { show, name, progress, trigger, setShow, setName, setProgress }
}
