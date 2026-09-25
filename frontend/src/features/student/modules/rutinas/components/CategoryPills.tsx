import { BLUE } from '@/features/student/components/ui/fitness'
import { MUSCLE_IMG, FULL_BODY_IMG } from '../routineAssets'

const SIZES = {
  md: { fontSize: 10, img: 'w-3 h-3', gap: 'gap-1', pad: 'px-2 py-0.5' },
  lg: { fontSize: 12, img: 'w-4 h-4', gap: 'gap-1.5', pad: 'px-2.5 py-1' },
} as const

interface CategoryPillProps {
  group: string
  size?: 'md' | 'lg'
}

export function CategoryPill({ group, size = 'md' }: CategoryPillProps) {
  const s = SIZES[size]
  return (
    <span
      className={`inline-flex items-center ${s.gap} ${s.pad} rounded-full font-bold flex-shrink-0`}
      style={{ background: BLUE + '1f', color: BLUE, fontSize: s.fontSize, border: `1px solid ${BLUE}45` }}
    >
      <img src={MUSCLE_IMG[group] ?? FULL_BODY_IMG} alt={group} className={`${s.img} object-cover rounded-sm flex-shrink-0`} />
      <span className="whitespace-nowrap">{group}</span>
    </span>
  )
}

interface CategoryPillsProps {
  groups: string[]
  size?: 'md' | 'lg'
}

export function CategoryPills({ groups, size = 'md' }: CategoryPillsProps) {
  return (
    <>
      {groups.map((g, gi) => (
        <CategoryPill key={gi} group={g} size={size} />
      ))}
    </>
  )
}