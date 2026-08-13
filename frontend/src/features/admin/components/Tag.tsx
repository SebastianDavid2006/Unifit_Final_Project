import type { CSSProperties, ReactNode } from 'react'

interface TagProps {
  children: ReactNode
  color: string
  bg: string
  border?: string
  icon?: ReactNode
  dot?: boolean
  size?: 'sm' | 'md'
  weight?: 'bold' | 'extrabold'
  className?: string
  style?: CSSProperties
}

export default function Tag({ children, color, bg, border, icon, dot, size = 'md', weight = 'bold', className = '', style }: TagProps) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 ${size === 'sm' ? 'px-2.5 py-0.5' : 'px-2.5 py-1'} rounded-lg text-[10px] ${weight === 'extrabold' ? 'font-extrabold' : 'font-bold'} w-fit ${className}`}
      style={{ background: bg, color, ...(border ? { border: `1px solid ${border}` } : {}), ...style }}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full" style={{ background: color }} />}
      {icon}
      {children}
    </span>
  )
}
