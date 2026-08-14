import { motion } from 'motion/react'
import { ChevronRight } from 'lucide-react'
import type { Trainer } from '@/data/trainers'
import Tag from '@/features/admin/components/Tag'
import { roleMeta, statusMeta } from '../data'

export default function TrainerRow({ trainer, index, onClick }: {
  trainer: Trainer
  index: number
  onClick: (t: Trainer) => void
}) {
  const rm = roleMeta[trainer.role]
  const st = statusMeta[trainer.status]
  const RoleIcon = rm.icon
  return (
    <motion.div
      key={trainer.id}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onClick(trainer)}
      whileHover={{ y: -3, scale: 1.002 }}
      className="grid grid-cols-[1.9fr_1.1fr_0.8fr_1.3fr_auto] items-center gap-4 p-4 rounded-2xl premium-card cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: trainer.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : 'linear-gradient(135deg, #8E8E93, #636366)', fontSize: 13 }}>{trainer.avatar}</div>
        <div className="min-w-0">
          <p className="text-[#1A1A1E] text-sm font-bold truncate">{trainer.name}</p>
          <p className="text-xs mt-0.5 font-mono font-semibold truncate" style={{ color: 'rgba(0,0,0,0.6)' }}>{trainer.document}</p>
        </div>
      </div>

      <Tag color={rm.color} bg={rm.bg} border={rm.border} icon={<RoleIcon size={11} />}>
        {rm.label}
      </Tag>

      <p className="text-xs font-bold" style={{ color: '#1D1D1F' }}>{trainer.students}</p>

      <Tag color={st.color} bg={st.bg} dot className="ml-6">
        {st.label}
      </Tag>

      <ChevronRight size={15} style={{ color: 'rgba(0,0,0,0.12)' }} />
    </motion.div>
  )
}
