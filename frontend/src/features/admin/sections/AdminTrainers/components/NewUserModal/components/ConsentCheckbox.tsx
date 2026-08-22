import { motion } from 'motion/react'
import { Check } from 'lucide-react'
import { BLUE, BLUE_GRAD } from '../data'

export default function ConsentCheckbox({ checked, onChange, label }: {
  checked: boolean
  onChange: (v: boolean) => void
  label: string
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        onClick={() => onChange(!checked)}
        className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 cursor-pointer"
        style={{
          background: checked ? BLUE_GRAD : 'transparent',
          border: `1.5px solid ${checked ? BLUE : 'rgba(0,0,0,0.06)'}`,
        }}
      >
        {checked && (
          <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 400, damping: 20 }}>
            <Check size={12} color="white" strokeWidth={3} />
          </motion.span>
        )}
      </div>
      <span style={{
        fontSize: 12,
        fontWeight: 500,
        lineHeight: 1.6,
        color: checked ? 'transparent' : 'rgba(0,0,0,0.55)',
        background: checked ? BLUE_GRAD : 'none',
        backgroundClip: checked ? 'text' : 'none',
        WebkitBackgroundClip: checked ? 'text' : 'none',
      }}>
        {label}
      </span>
    </label>
  )
}
