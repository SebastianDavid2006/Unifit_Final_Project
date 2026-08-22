import { BLUE } from '@/features/student/components/ui/fitness'
import { personalSections } from '../profileData'

export function PersonalDataPanel() {
  return (
    <>
      {personalSections.map(sec => (
        <div key={sec.title}>
          <p className="uppercase tracking-[0.18em] mb-2 mt-1" style={{ fontSize: 9.5, fontWeight: 800, color: BLUE }}>{sec.title}</p>
          <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {sec.items.map((d, i) => (
              <div key={i} className="flex items-center justify-between gap-3 px-4 py-2.5" style={{ borderBottom: i < sec.items.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: 'rgba(255,255,255,0.42)', fontSize: 12 }}>{d.label}</span>
                <span className="text-white font-semibold text-right" style={{ fontSize: 12.5 }}>{d.value}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </>
  )
}
