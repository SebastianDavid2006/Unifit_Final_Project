import { motion } from 'motion/react'
import { LayoutDashboard, Users, Dumbbell, Calendar, PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { useIsMobile } from '@/shared/components/ui/use-mobile'

export type TrainerSection = 'dashboard' | 'students' | 'equipment' | 'schedule'

export const TRAINER_SIDEBAR_ITEMS: { id: TrainerSection; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'students', label: 'Usuarios', icon: Users },
  { id: 'equipment', label: 'Máquinas', icon: Dumbbell },
  { id: 'schedule', label: 'Agenda', icon: Calendar },
]

interface Props {
  section: TrainerSection
  expanded: boolean
  onToggle: () => void
  onSectionChange: (s: TrainerSection) => void
}

export default function TrainerSidebar({ section, expanded, onToggle, onSectionChange }: Props) {
  const items = TRAINER_SIDEBAR_ITEMS
  const isMobile = useIsMobile()

  // Mobile: bottom navigation bar
  if (isMobile) {
    return (
      <nav
        className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-around px-2 py-2"
        style={{
          background: 'linear-gradient(180deg, #0A1A3A 0%, #2A0A10 40%, #101014 65%, #2A1E08 100%)',
          borderTop: '1px solid rgba(255,255,255,0.04)',
          backdropFilter: 'blur(8px)',
        }}
      >
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSectionChange(item.id)}
            title={item.label}
            className={`flex items-center justify-center gap-2 rounded-xl transition-all duration-300 ${
              section === item.id
                ? 'flex-1 py-2.5 px-3 bg-gradient-to-r from-red-500/30 to-purple-500/30 text-white shadow-[0_0_12px_rgba(228,35,50,0.4),0_0_24px_rgba(43,44,138,0.3)] scale-105'
                : 'flex-1 py-2.5 px-3 text-white/50 hover:text-white hover:bg-white/10'
            }`}
            style={{ minWidth: 0 }}
          >
            <item.icon size={22} className="flex-shrink-0" />
            <span className="text-xs font-medium truncate">{item.label}</span>
          </button>
        ))}
      </nav>
    )
  }

  // Desktop: vertical sidebar
  return (
    <aside
      className={`${expanded ? 'w-52' : 'w-[68px]'} flex flex-col items-center pt-8 pb-4 gap-1 flex-shrink-0 z-50 relative`}
      style={{
        background: 'linear-gradient(180deg, #0A1A3A 0%, #2A0A10 40%, #101014 65%, #2A1E08 100%)',
        borderRight: '1px solid rgba(255,255,255,0.04)',
        overflow: 'hidden',
        transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div className="flex-shrink-0" style={{ width: '100%', height: 44, marginBottom: 24, marginTop: 8 }}>
        <button
          onClick={onToggle}
          className="w-11 h-11 rounded-xl flex items-center justify-center
            border border-transparent
            hover:bg-white/[0.06] hover:backdrop-blur-md hover:border-white/10 hover:shadow-lg"
          style={{
            position: 'absolute',
            top: 8,
            left: expanded ? 'calc(100% - 56px)' : 'calc(50% - 22px)',
            color: 'rgba(255,255,255,0.5)',
            zIndex: 60,
            transition: 'left 0.4s cubic-bezier(0.4, 0, 0.2, 1), background 0.3s ease, backdrop-filter 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease',
          }}
          title={expanded ? 'Colapsar' : 'Expandir'}
        >
          {expanded ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
        </button>
      </div>

      <div className="flex flex-col w-full relative">
        {/* Gooey layer */}
        <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ filter: 'url(#goo)' }}>
          {items.flatMap((item, i, arr) => {
            const groups = [[arr[0]], [arr[1], arr[2]], [arr[3]]]
            const groupIdx = groups.findIndex(g => g.includes(item))
            const isFirstInGroup = groups[groupIdx]?.[0] === item
            return [
              ...(groupIdx > 0 && isFirstInGroup ? [{ type: 'divider' as const, h: 20 }] : []),
              { type: 'indicator' as const, id: item.id, isActive: section === item.id },
            ]
          }).map((entry, idx) =>
            entry.type === 'divider' ? (
              <div key={`div-${idx}`} />
            ) : (
              <div key={entry.id} className="overflow-hidden flex-shrink-0" style={{
                height: 44,
                width: expanded ? '100%' : 68,
                borderRadius: expanded ? 10 : 0,
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease',
              }}>
                {entry.isActive && false && (
                  <motion.div
                    layoutId="goo-indicator"
                    className="size-full"
                    style={{
                    background: 'linear-gradient(135deg, #e42332, #2b2c8a, #efbb29)',
                    boxShadow: 'inset 0 0 60px rgba(228,35,50,0.35), inset 0 0 120px rgba(43,44,138,0.3), 0 0 30px rgba(228,35,50,0.12), 0 0 60px rgba(43,44,138,0.06)',
                    }}
                    transition={{ type: 'spring', stiffness: 260, damping: 22, mass: 0.6 }}
                  />
                )}
              </div>
            )
          )}
        </div>
        {/* Buttons layer */}
        {items.flatMap((item, i, arr) => {
          const groups = [[arr[0]], [arr[1], arr[2]], [arr[3]]]
          const groupIdx = groups.findIndex(g => g.includes(item))
          const isFirstInGroup = groups[groupIdx]?.[0] === item
          return [
            ...(groupIdx > 0 && isFirstInGroup ? [{ type: 'divider' as const }] : []),
            { type: 'item' as const, item },
          ]
        }).map((entry, idx) =>
          entry.type === 'divider' ? (
            <div key={`div-${idx}`} className="h-px rounded-full my-0.5 flex-shrink-0" style={{
              width: expanded ? 160 : 20,
              marginLeft: expanded ? 24 : 24,
              background: 'linear-gradient(90deg, rgba(18,112,183,0.12), rgba(244,56,67,0.08), rgba(241,200,39,0.06), transparent)',
              transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          ) : (
            <button
              key={entry.item.id}
              onClick={() => onSectionChange(entry.item.id)}
              title={entry.item.label}
              className="relative flex items-center flex-shrink-0 overflow-hidden"
              style={{
                height: 44,
                width: expanded ? '100%' : 68,
                paddingLeft: 0,
                borderRadius: expanded ? 10 : 0,
                background: 'transparent',
                color: section === entry.item.id ? '#fff' : 'rgba(255,255,255,0.2)',
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease, color 0.3s ease',
              }}
            >
              {/* Resplandor izquierdo vibrante */}
              {section === entry.item.id && (
                <div className="absolute top-0 bottom-0 pointer-events-none" style={{
                  left: -16,
                  width: expanded ? 'calc(100% + 200px)' : 'calc(100% + 140px)',
                  background: 'linear-gradient(90deg, rgba(228,35,50,0.35) 0%, rgba(43,44,138,0.18) 22%, rgba(239,187,41,0.06) 42%, transparent 58%)',
                  filter: 'blur(8px)',
                }} />
              )}
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 68, height: 44 }}>
                <entry.item.icon size={19} />
              </div>
              <span style={{
                opacity: expanded ? 1 : 0,
                transition: 'opacity 0.3s ease 0.05s',
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                {entry.item.label}
              </span>
            </button>
          )
        )}
      </div>
    </aside>
  )
}
