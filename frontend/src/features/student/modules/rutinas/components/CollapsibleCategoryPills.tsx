import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BLUE } from '@/features/student/components/ui/fitness'
import { CategoryPills, CategoryPill } from './CategoryPills'

const MAX_VISIBLE = 3
const COLLAPSE_THRESHOLD = 4
const GAP = 8

interface CollapsibleCategoryPillsProps {
  groups: string[]
}

export function CollapsibleCategoryPills({ groups }: CollapsibleCategoryPillsProps) {
  const [open, setOpen] = useState(false)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const circleRef = useRef<HTMLButtonElement>(null)
  const popRef = useRef<HTMLDivElement>(null)

  const collapsed = groups.length > COLLAPSE_THRESHOLD

  useLayoutEffect(() => {
    if (!open) return
    const circle = circleRef.current?.getBoundingClientRect()
    const pop = popRef.current
    if (!circle || !pop) {
      setPos(null)
      return
    }
    const w = pop.offsetWidth
    const h = pop.offsetHeight
    const centerX = circle.left + circle.width / 2
    const left = Math.max(12, Math.min(centerX - w / 2, window.innerWidth - w - 12))
    const spaceAbove = circle.top
    const preferredTop = spaceAbove >= h + GAP ? circle.top - GAP - h : circle.bottom + GAP
    const top = Math.max(8, Math.min(preferredTop, window.innerHeight - h - 8))
    setPos({ top, left })
  }, [open])

  useEffect(() => {
    if (!open) return
    const close = () => setOpen(false)
    window.addEventListener('scroll', close, true)
    window.addEventListener('resize', close)
    return () => {
      window.removeEventListener('scroll', close, true)
      window.removeEventListener('resize', close)
    }
  }, [open])

  if (!collapsed) {
    return <CategoryPills groups={groups} size="lg" />
  }

  return (
    <>
      <CategoryPills groups={groups.slice(0, MAX_VISIBLE)} size="lg" />
      <button
        ref={circleRef}
        onClick={(e) => { e.stopPropagation(); setOpen(o => !o) }}
        className="w-8 h-8 rounded-full flex items-center justify-center font-black cursor-pointer"
        style={{ background: BLUE + '14', color: BLUE, border: `1px solid ${BLUE}30`, fontSize: 12 }}
        aria-label={`Ver ${groups.length - MAX_VISIBLE} categorías`}
      >
        +{groups.length - MAX_VISIBLE}
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-[55]" onClick={(e) => { e.stopPropagation(); setOpen(false) }} />
            <motion.div
              ref={popRef}
              initial={{ opacity: 0 }}
              animate={{ opacity: pos ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.14, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="fixed z-[56] p-3 rounded-2xl"
              style={{
                top: pos ? pos.top : 0,
                left: pos ? pos.left : -9999,
                visibility: pos ? 'visible' : 'hidden',
                width: 340,
                maxWidth: 'calc(100vw - 24px)',
                background: '#12121C',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 16px 48px rgba(0,0,0,0.55)',
              }}
            >
              <div className="flex flex-wrap gap-2 justify-center">
                {groups.slice(MAX_VISIBLE).map((g, gi) => (
                  <CategoryPill key={gi} group={g} size="lg" />
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}