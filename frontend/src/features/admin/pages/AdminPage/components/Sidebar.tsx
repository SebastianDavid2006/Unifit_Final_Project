import { motion } from 'motion/react'
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react'
import { sidebarItems } from '../data'
import type { AdminSection } from '../data'

export default function Sidebar({ expanded, section, onToggle, onSectionChange }: {
  expanded: boolean
  section: AdminSection
  onToggle: () => void
  onSectionChange: (s: AdminSection) => void
}) {
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

      <div className="flex flex-col w-full relative flex-1">
        <div className="absolute inset-0 flex flex-col pointer-events-none" style={{ filter: 'url(#goo)' }}>
          {sidebarItems.map(item => (
            <div key={item.id} className="overflow-hidden flex-shrink-0" style={{
              height: 44,
              width: expanded ? '100%' : 68,
              borderRadius: expanded ? 10 : 0,
              transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease',
            }}>
              {section === item.id && false && (
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
          ))}
        </div>

        {sidebarItems.map((item, idx) => (
          <div key={item.id} className={item.id === 'config' ? 'flex flex-col flex-1' : ''}>
            {idx > 0 && !(item.id === 'config') && (
              <div className="h-px rounded-full my-0.5 flex-shrink-0" style={{
                width: expanded ? 160 : 20,
                marginLeft: expanded ? 24 : 24,
                background: 'linear-gradient(90deg, rgba(18,112,183,0.12), rgba(244,56,67,0.08), rgba(241,200,39,0.06), transparent)',
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            )}
            {idx > 0 && item.id === 'config' && <div className="flex-1 min-h-[12px]" />}
            {item.id === 'config' && (
              <div className="h-px rounded-full my-2 flex-shrink-0" style={{
                width: expanded ? 160 : 20,
                marginLeft: expanded ? 24 : 24,
                background: 'linear-gradient(90deg, rgba(18,112,183,0.2), rgba(244,56,67,0.15), rgba(241,200,39,0.1), transparent)',
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
              }} />
            )}
            <button
              onClick={() => onSectionChange(item.id)}
              title={item.label}
              className="relative flex items-center flex-shrink-0 overflow-hidden"
              style={{
                height: 44,
                width: expanded ? '100%' : 68,
                paddingLeft: 0,
                borderRadius: expanded ? 10 : 0,
                background: 'transparent',
                color: section === item.id ? '#fff' : 'rgba(255,255,255,0.2)',
                transition: 'width 0.45s cubic-bezier(0.4, 0, 0.2, 1), border-radius 0.35s ease, color 0.3s ease',
              }}
            >
              {section === item.id && (
                <div className="absolute top-0 bottom-0 pointer-events-none" style={{
                  left: -16,
                  width: expanded ? 'calc(100% + 200px)' : 'calc(100% + 140px)',
                  background: 'linear-gradient(90deg, rgba(228,35,50,0.35) 0%, rgba(43,44,138,0.18) 22%, rgba(239,187,41,0.06) 42%, transparent 58%)',
                  filter: 'blur(8px)',
                }} />
              )}
              <div className="flex items-center justify-center flex-shrink-0" style={{ width: 68, height: 44 }}>
                <item.icon size={19} />
              </div>
              <span style={{
                opacity: expanded ? 1 : 0,
                transition: 'opacity 0.3s ease 0.05s',
                fontSize: 12,
                fontWeight: 500,
                whiteSpace: 'nowrap',
              }}>
                {item.label}
              </span>
            </button>
          </div>
        ))}
      </div>
    </aside>
  )
}
