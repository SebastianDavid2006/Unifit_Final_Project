import { motion } from 'motion/react'
import { Plus } from 'lucide-react'

export default function AddButton({ background, glow, onClick }: { background: string; glow: string; onClick: () => void }) {
  return (
    <motion.button
      initial="rest"
      whileHover="hover"
      animate="rest"
      onClick={onClick}
      title="Agregar"
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
      variants={{ rest: { width: 36 }, hover: { width: 92 } }}
      className="absolute right-6 top-1/2 h-9 flex items-center justify-end rounded-xl overflow-hidden flex-shrink-0 text-white cursor-pointer"
      style={{ background, boxShadow: `0 8px 20px ${glow}`, marginTop: -18 }}
    >
      <motion.span
        variants={{
          rest: { width: 0, opacity: 0, marginRight: 0 },
          hover: { width: 54, opacity: 1, marginRight: 2 },
        }}
        className="whitespace-nowrap text-xs font-bold overflow-hidden"
      >
        Agregar
      </motion.span>
      <div className="h-9 flex items-center justify-center px-2.5 flex-shrink-0">
        <Plus size={16} strokeWidth={2.6} />
      </div>
    </motion.button>
  )
}
