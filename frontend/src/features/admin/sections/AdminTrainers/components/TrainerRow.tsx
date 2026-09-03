import { motion } from 'motion/react'
import { ChevronRight, CalendarDays } from 'lucide-react'
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
      className="grid grid-cols-[1.9fr_1.1fr_1.3fr_1.3fr_auto] items-center gap-4 p-4 rounded-2xl premium-card cursor-pointer"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold flex-shrink-0" style={{ background: trainer.status === 'active' ? 'linear-gradient(135deg, #30D158, #20A040)' : trainer.status === 'process' ? 'linear-gradient(135deg, #1270B7, #7ec8e3)' : 'linear-gradient(135deg, #8E8E93, #636366)', fontSize: 13 }}>{trainer.avatar}</div>
        <p className="text-[#1A1A1E] text-sm font-bold truncate">{trainer.name}</p>
      </div>

      <Tag color={rm.color} bg={rm.bg} border={rm.border} icon={<RoleIcon size={11} />}>
        {rm.label}
      </Tag>

      <Tag color={st.color} bg={st.bg} dot>
        {st.label}
      </Tag>

      <p className="flex items-center gap-1.5 text-xs font-semibold" style={{ color: 'rgba(0,0,0,0.6)' }}>
        <CalendarDays size={13} style={{ color: 'rgba(0,0,0,0.35)' }} />
        {trainer.joinedAt}
      </p>

      <ChevronRight size={15} style={{ color: 'rgba(0,0,0,0.12)' }} />
    </motion.div>
  )
}
